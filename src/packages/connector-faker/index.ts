import * as fake from 'faker';

export const faker = ({ FAKER_LOCALE = 'en', FAKER_SEED = null }: any): any => {
  (<any>fake).locale = FAKER_LOCALE;
  if (FAKER_SEED) {
    fake.seed(FAKER_SEED);
  }
  return fake;
};
