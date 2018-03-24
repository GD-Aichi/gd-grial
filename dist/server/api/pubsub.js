"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
exports.getPubsub = async () => {
    const pubsub = new graphql_subscriptions_1.PubSub();
    return pubsub;
};
//# sourceMappingURL=pubsub.js.map