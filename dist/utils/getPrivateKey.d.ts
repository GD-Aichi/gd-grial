/**
 * Require the grial.config or get a default empty object
 * @param  {String} [BASE_PATH='.'] The base path of your application
 * @return {Object}                 The configuration object
 */
export declare const getPrivateKey: (BASE_PATH?: string) => Promise<string>;
