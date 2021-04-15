/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({
  path: '.env.testing',
});

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
