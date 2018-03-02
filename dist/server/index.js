"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// native
const http_1 = require("http");
const url_1 = require("url");
const jwt = require("jsonwebtoken");
// packages
const graphql_tools_1 = require("graphql-tools");
const graphql_server_core_1 = require("graphql-server-core");
const graphql_server_module_graphiql_1 = require("graphql-server-module-graphiql");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const graphql_1 = require("graphql");
const micro_1 = require("micro");
// API layer
const resolvers_1 = require("./api/resolvers");
const schema_1 = require("./api/schema");
const directiveResolvers_1 = require("./api/directiveResolvers");
const utils_1 = require("../utils");
// Business logic layer
const connectors_1 = require("./app/connectors");
const loaders_1 = require("./app/loaders");
const models_1 = require("./app/models");
const utilities_1 = require("./app/utilities");
const services_1 = require("./app/services");
/**
 * Grial server
 * @type {Class}
 */
class Grial {
    constructor(env) {
        this.env = env;
    }
    /**
     * Prepare the API schema and the app models and connectors
     * @param  {Object} env The app environment variables
     * @return {Object}     The schema, connectors and models
     */
    async prepare() {
        const { BASE_PATH = '.' } = this.env;
        // Grial config
        this.config = await utils_1.getConfig(BASE_PATH);
        if ('graphqlConfig' in this.config) {
            console.log('Custom `graphqlConfig` found in grial.config.');
        }
        if ('graphiqlConfig' in this.config) {
            console.log('Custom `graphiqlConfig` found in grial.config.');
        }
        if ('subscriptionConfig' in this.config) {
            console.log('Custom `subscriptionConfig` found in grial.config.');
        }
        // Grial auth
        this.auth = await utils_1.getAuth(BASE_PATH);
        if (this.auth.createToken && this.auth.refreshToken) {
            this.SECRET = await utils_1.getPrivateKey(BASE_PATH);
            if (this.SECRET) {
                console.log('Auth found.');
            }
        }
        // create schema
        const resolvers = await resolvers_1.getResolvers(BASE_PATH);
        const typeDefs = await schema_1.getSchema(BASE_PATH);
        const directiveResolvers = await directiveResolvers_1.getDirectiveResolvers(BASE_PATH);
        const schema = graphql_tools_1.makeExecutableSchema({ typeDefs, resolvers, directiveResolvers });
        this.schema = schema;
        // create connectors
        const connectors = await connectors_1.getConnectors(BASE_PATH);
        const instancedConnectors = (await Promise.all(Object.entries(connectors).map(utils_1.instantiate(this.env)))).reduce(utils_1.mergeInstances, {});
        this.connectors = instancedConnectors;
        // create models
        const models = await models_1.getModels(BASE_PATH);
        const modelParams = Object.assign({}, { env: this.env }, instancedConnectors);
        const instancedModels = (await Promise.all(Object.entries(models).map(utils_1.instantiate(modelParams)))).reduce(utils_1.mergeInstances, {});
        this.models = instancedModels;
        // create utility
        const utilities = await utilities_1.getUtilities(BASE_PATH);
        const utilityParams = Object.assign({}, { env: this.env }, instancedConnectors, instancedModels);
        const instancedUtility = (await Promise.all(Object.entries(utilities).map(utils_1.instantiate(utilityParams)))).reduce(utils_1.mergeInstances, {});
        this.utilities = instancedUtility;
        // create service
        const services = await services_1.getServices(BASE_PATH);
        const servicesParams = Object.assign({}, { env: this.env }, instancedConnectors, instancedModels, instancedUtility);
        const instancedServices = (await Promise.all(Object.entries(services).map(utils_1.instantiate(servicesParams)))).reduce(utils_1.mergeInstances, {});
        this.services = instancedServices;
        // get loaders
        this.loaders = await loaders_1.getLoaders(BASE_PATH);
        this.context = {
            connectors: this.connectors,
            models: this.models,
            loaders: this.loaders,
            utilities: this.utilities,
            services: this.services,
            SECRET: this.SECRET
        };
    }
    /**
     * Run a simple HTTP and WS (subscriptions) server
     * @return {[type]} [description]
     */
    run() {
        const { PORT = 3000, HOST = 'localhost', SUBSCRIPTION_PATH = 'subscriptions' } = this.env;
        const server = http_1.createServer(this.getRequestHandler());
        return new Promise((resolve, reject) => {
            server.listen(PORT, HOST, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve({
                    http: server,
                    ws: new subscriptions_transport_ws_1.SubscriptionServer(this.getSubscriptionOptions(), {
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
    async getGraphQLOptions(request) {
        const { schema, models, utilities, services, connectors, config, env, SECRET } = this;
        const loaders = await this.getLoaders(request);
        const baseOptions = {
            schema,
            context: { request, connectors, models, loaders, utilities, services },
            debug: env.NODE_ENV !== 'production'
        };
        if ('graphqlConfig' in config) {
            return Object.assign({}, baseOptions, config.graphqlConfig({
                schema,
                request,
                connectors,
                models,
                utilities,
                services,
                loaders,
                env,
                SECRET,
                auth: {
                    isAuthenticated: !!request.user,
                    user: request.user
                }
            }));
        }
        return baseOptions;
    }
    /**
     * Get application loaders instances
     * @param  {Object} request HTTP request
     * @return {Object}         Loaders instances
     */
    async getLoaders(request) {
        const { models, connectors, env, loaders } = this;
        const loaderParams = Object.assign({}, request, env, connectors, models);
        return (await Promise.all(Object.entries(loaders).map(utils_1.instantiate(loaderParams)))).reduce(utils_1.mergeInstances, {});
    }
    /**
     * Get GraphiQL configuration options
     * @return {Object} GraphiQL options
     */
    getGraphiQLOptions({ request, query }) {
        const { env, config } = this;
        const { PUBLIC_HOST = env.HOST || 'localhost', PUBLIC_PORT = env.PORT || 3000, SUBSCRIPTION_PATH = 'subscriptions', SSL_ENABLED = false } = env;
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
    getSubscriptionOptions() {
        const { env, config, schema } = this;
        if ('subscriptionConfig' in config) {
            return Object.assign({}, { schema }, config.subscriptionConfig({ env, schema }), {
                execute: graphql_1.execute,
                subscribe: graphql_1.subscribe,
            });
        }
        return { schema, execute: graphql_1.execute, subscribe: graphql_1.subscribe };
    }
    async addUser(request, response, next = null) {
        const token = request.headers['x-token'];
        if (token) {
            try {
                const { user } = jwt.verify(token, this.SECRET);
                request.user = user;
            }
            catch (err) {
                const refreshToken = request.headers['x-refresh-token'];
                const newTokens = await this.auth.refreshToken(token, refreshToken, this.models, this.SECRET);
                if (newTokens.token && newTokens.refreshToken) {
                    response.setHeader('Access-Control-Expose-Headers', ['x-token', 'x-refresh-token']);
                    response.setHeader('x-token', newTokens.token);
                    response.setHeader('x-refresh-token', newTokens.refreshToken);
                }
                request.user = newTokens.user;
            }
        }
    }
    /**
     * Create the HTTP request handler
     * @return {Function} The HTTP request handler
     */
    getRequestHandler({ graphql = 'POST /graphql', graphiql = 'GET /ide' } = {}) {
        /**
         * Grail HTTP request handler
         * @param  {Object}   request  The HTTP request
         * @param  {Object}   response The HTTP response
         * @param  {Function} next     Call the next middleware
         * @return {Function}          Request handler
         */
        return async (request, response, next = null) => {
            // const { env } = this;
            const url = url_1.parse(request.url, true);
            const formatedURL = `${request.method.toUpperCase()} ${url.pathname}`;
            // handle GraphQL queries
            if (formatedURL === graphql) {
                // add auth
                if (this.SECRET) {
                    await this.addUser(request, response);
                }
                try {
                    const data = await graphql_server_core_1.runHttpQuery([request, response], {
                        method: request.method,
                        options: await this.getGraphQLOptions(request),
                        query: request.method === 'POST' ? request.body || (await micro_1.json(request)) : url.query
                    });
                    response.setHeader('Content-Type', 'application/json');
                    response.write(data);
                }
                catch (error) {
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
                    const graphiqlString = await graphql_server_module_graphiql_1.resolveGraphiQLString(query, this.getGraphiQLOptions({ query, request }), request);
                    response.setHeader('Content-Type', 'text/html');
                    response.write(graphiqlString);
                }
                catch (error) {
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
exports.Grial = Grial;
//# sourceMappingURL=index.js.map