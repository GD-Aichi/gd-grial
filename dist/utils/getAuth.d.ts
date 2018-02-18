/**
 * Require the auth or get a default empty object
 * @param  {String} [BASE_PATH='.'] The base path of your application
 * @return {Object}                 The auth object
 */
export declare const getAuth: (BASE_PATH?: string) => Promise<any>;
