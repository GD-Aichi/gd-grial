"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fake = require("faker");
exports.faker = ({ FAKER_LOCALE = 'en', FAKER_SEED = null }) => {
    fake.locale = FAKER_LOCALE;
    if (FAKER_SEED) {
        fake.seed(FAKER_SEED);
    }
    return fake;
};
//# sourceMappingURL=index.js.map