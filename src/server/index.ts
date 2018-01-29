// native
import { createServer, IncomingMessage, ServerResponse, Server } from 'http';
import { parse, UrlWithParsedQuery } from 'url';

// packages
import { makeExecutableSchema } from 'graphql-tools';
import { runHttpQuery } from 'graphql-server-core';
import { resolveGraphiQLString } from 'graphql-server-module-graphiql';
// const { makeExecutableSchema } = require('graphql-tools')
//const { runHttpQuery } = require('graphql-server-core')
//const GraphiQL = require('graphql-server-module-graphiql')
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { json } from 'micro';
import { instantiate, mergeInstances, getConfig } from '../utils';
// const { SubscriptionServer } = require('subscriptions-transport-ws')
// const { execute, subscribe } = require('graphql')
// const { json } = require('micro')
// const { instantiate, mergeInstances, getConfig } = require('@grial/utils')

// API layer
import { getResolvers } from './api/resolvers';
import { getSchema } from './api/schema';

// Business logic layer
import { getConnectors } from './app/connectors';
import { getLoaders } from './app/loaders';
import { getModels } from './app/models';
import { getUtilities } from './app/utilities';
import { getServices } from './app/services';

/**
 * Grial server
 * @type {Class}
 */
export class Grial {

  private env: any;

  private config: any;

  private schema: any;

  private connectors: any;

  private models: any;

  private utilities: any;

  private services: any;

  private loaders: any;

  constructor(env: any) {
    this.env = env;
  }

  /**
   * Prepare the API schema and the app models and connectors
   * @param  {Object} env The app environment variables
   * @return {Object}     The schema, connectors and models
   */
  public async prepare() {
    const { BASE_PATH = '.' } = this.env;

    // Grial config
    this.config = await getConfig(BASE_PATH);
    if ('graphqlConfig' in this.config) {
      console.log('Custom `graphqlConfig` found in grial.config.');
    }
    if ('graphiqlConfig' in this.config) {
      console.log('Custom `graphiqlConfig` found in grial.config.');
    }
    if ('subscriptionConfig' in this.config) {
      console.log('Custom `subscriptionConfig` found in grial.config.');
    }

    // create schema
    const resolvers = await getResolvers(BASE_PATH);
    const typeDefs = await getSchema(BASE_PATH);
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    this.schema = schema;

    // create connectors
    const connectors = await getConnectors(BASE_PATH);
    const instancedConnectors = (await Promise.all(
      Object.entries(connectors).map(<any>instantiate(this.env))
    )).reduce(mergeInstances, {});
    this.connectors = instancedConnectors;

    // create models
    const models = await getModels(BASE_PATH);
    const modelParams = Object.assign({}, this.env, instancedConnectors);
    const instancedModels = (await Promise.all(
      Object.entries(models).map(<any>instantiate(modelParams))
    )).reduce(mergeInstances, {});
    this.models = instancedModels;

    // create utility
    const utilities = await getUtilities(BASE_PATH);
    const utilityParams = Object.assign({}, this.env, instancedConnectors, instancedModels);
    const instancedUtility = (await Promise.all(
      Object.entries(utilities).map(<any>instantiate(utilityParams))
    )).reduce(mergeInstances, {});
    this.utilities = instancedUtility;

    // create service
    const services = await getServices(BASE_PATH);
    const servicesParams = Object.assign({}, this.env, instancedConnectors, instancedModels, instancedUtility);
    const instancedServices = (await Promise.all(
      Object.entries(services).map(<any>instantiate(servicesParams))
    )).reduce(mergeInstances, {});
    this.services = instancedServices;

    // get loaders
    this.loaders = await getLoaders(BASE_PATH);
  }

  /**
   * Run a simple HTTP and WS (subscriptions) server
   * @return {[type]} [description]
   */
  public run(): Promise<{http: Server, ws: any}> {
    const { PORT = 3000, HOST = 'localhost', SUBSCRIPTION_PATH = 'subscriptions' } = this.env;

    const server: Server = createServer(this.getRequestHandler());

    return new Promise<any>((resolve, reject) => {
      server.listen(PORT, HOST, (error?: any) => {
        if (error) {
          return reject(error);
        }
        resolve({
          http: server,
          ws: new SubscriptionServer(this.getSubscriptionOptions(), {
            server,
            path: `/${SUBSCRIPTION_PATH}`,
          }),
        });
      });
    });
  }

  /**
   * Get GraphQL request options
   * @return {Object} The GraphQL options
   */
  public async getGraphQLOptions(request: IncomingMessage): Promise<any> {
    const { schema, models, utilities, services, connectors, config, env } = this;

    const loaders = await this.getLoaders(request);

    const baseOptions = {
      schema,
      context: { request, connectors, models, loaders, utilities, services },
      debug: env.NODE_ENV !== 'production'
    };

    if ('graphqlConfig' in config) {
      return Object.assign(
        {},
        baseOptions,
        config.graphqlConfig({
          schema,
          request,
          connectors,
          models,
          utilities,
          services,
          loaders,
          env
        })
      );
    }

    return baseOptions;
  }

  /**
   * Get application loaders instances
   * @param  {Object} request HTTP request
   * @return {Object}         Loaders instances
   */
  private async getLoaders(request: IncomingMessage) {
    const { models, utilities, services, connectors, env, loaders } = this;
    const loaderParams = Object.assign({}, request, env, connectors, models, utilities, services);
    return (await Promise.all(Object.entries(loaders).map(<any>instantiate(loaderParams)))).reduce(
      mergeInstances,
      {}
    );
  }

  /**
   * Get GraphiQL configuration options
   * @return {Object} GraphiQL options
   */
  private getGraphiQLOptions({ request, query }: {request: IncomingMessage, query: any}) {
    const { env, config } = this;

    const {
      PUBLIC_HOST = env.HOST || 'localhost',
      PUBLIC_PORT = env.PORT || 3000,
      SUBSCRIPTION_PATH = 'subscriptions',
      SSL_ENABLED = false
    } = env;

    let PROTOCOL = 'ws';
    if (SSL_ENABLED) {
      PROTOCOL = 'wss';
    }

    const baseOptions = {
      endpointURL: '/graphql',
      subscriptionsEndpoint: `${PROTOCOL}://${PUBLIC_HOST}:${PUBLIC_PORT}/${SUBSCRIPTION_PATH}`,
    };

    if ('graphiqlConfig' in config) {
      return Object.assign({}, baseOptions, config.graphiqlConfig({ query, request, env }));
    }
    return baseOptions;
  }

  /**
   * Get WS Subscription server options
   * @return {Object} Options
   */
  private getSubscriptionOptions() {
    const { env, config, schema } = this;

    if ('subscriptionConfig' in config) {
      return Object.assign({}, { schema }, config.subscriptionConfig({ env, schema }), {
        execute,
        subscribe,
      });
    }

    return { schema, execute, subscribe };
  }

  /**
   * Create the HTTP request handler
   * @return {Function} The HTTP request handler
   */
  private getRequestHandler({ graphql = 'POST /graphql', graphiql = 'GET /ide' } = {}) {
    /**
     * Grail HTTP request handler
     * @param  {Object}   request  The HTTP request
     * @param  {Object}   response The HTTP response
     * @param  {Function} next     Call the next middleware
     * @return {Function}          Request handler
     */
    return async(request: IncomingMessage, response: ServerResponse, next: Function = null) => {
      // const { env } = this;

      const url: UrlWithParsedQuery = parse(request.url, true);

      const formatedURL: string = `${request.method.toUpperCase()} ${url.pathname}`;

      // handle GraphQL queries
      if (formatedURL === graphql) {
        try {
          const data = await runHttpQuery([request, response], {
            method: request.method,
            options: await this.getGraphQLOptions(request),
            query: request.method === 'POST' ? (<any>request).body || (await json(request)) : url.query
          });
          response.setHeader('Content-Type', 'application/json');
          response.write(data);
        } catch (error) {
          if (error.headers) {
            Object.entries(error.headers).forEach(([name, value]) => {
              response.setHeader(name, value);
            });
          }
          response.statusCode = error.statusCode || 500;
          response.write(error.message);
        }
        return response.end();
      }

      // render GraphiQL IDE
      if (formatedURL === graphiql) {
        const { query } = url;
        try {
          const graphiqlString = await resolveGraphiQLString(
            query,
            this.getGraphiQLOptions({ query, request }),
            request
          );
          response.setHeader('Content-Type', 'text/html');
          response.write(graphiqlString);
        } catch (error) {
          response.statusCode = error.statusCode || 500;
          response.write(error.message);
        }
        return response.end();
      }

      // if it's running inside Express/Connect try to call the next middleware
      if (next) {
        return next();
      }

      response.statusCode = 404;
      response.statusMessage = 'Not Found';
      return response.end();
    };
  }
}
