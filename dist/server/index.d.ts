/// <reference types="node" />
import { IncomingMessage, Server } from 'http';
/**
 * Grial server
 * @type {Class}
 */
export declare class Grial {
    context: any;
    schema: any;
    private env;
    private config;
    private auth;
    private connectors;
    private models;
    private utilities;
    private services;
    private loaders;
    private SECRET;
    constructor(env: any);
    /**
     * Prepare the API schema and the app models and connectors
     * @param  {Object} env The app environment variables
     * @return {Object}     The schema, connectors and models
     */
    prepare(): Promise<void>;
    /**
     * Run a simple HTTP and WS (subscriptions) server
     * @return {[type]} [description]
     */
    run(): Promise<{
        http: Server;
        ws: any;
    }>;
    /**
     * Get GraphQL request options
     * @return {Object} The GraphQL options
     */
    getGraphQLOptions(request: IncomingMessage): Promise<any>;
    /**
     * Get application loaders instances
     * @param  {Object} request HTTP request
     * @return {Object}         Loaders instances
     */
    private getLoaders(request);
    /**
     * Get GraphiQL configuration options
     * @return {Object} GraphiQL options
     */
    private getGraphiQLOptions({request, query});
    /**
     * Get WS Subscription server options
     * @return {Object} Options
     */
    private getSubscriptionOptions();
    private addUser(request, response, next?);
    /**
     * Create the HTTP request handler
     * @return {Function} The HTTP request handler
     */
    private getRequestHandler({graphql, graphiql}?);
}
