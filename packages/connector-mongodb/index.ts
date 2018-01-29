import * as MongoClient from 'mongodb';

const connectionsCache = {};

export const mongodb = async ({
  MONGO_USER,
  MONGO_PASS,
  MONGO_HOST = 'localhost',
  MONGO_NAME,
  MONGO_URL = null
}: any): Promise<any> => {
  const URL =
    MONGO_URL ||
    `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_NAME}`;

  if (!connectionsCache[URL]) {
    connectionsCache[URL] = new Promise(function(resolve, reject) {
      MongoClient.connect(URL, (error: any, connection: any) => {
        if (error) {
          console.log(error);
          reject(error);
        }

        resolve(connection);
      });
    });
  }

  return connectionsCache[URL];
};
