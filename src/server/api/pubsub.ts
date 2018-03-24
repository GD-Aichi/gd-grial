import { PubSub } from 'graphql-subscriptions';

export const getPubsub = async () => {
  const pubsub = new PubSub();
  return pubsub;
};
