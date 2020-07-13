const standardConfig = require('./browserstack-default');

const { OSX_FIREFOX_LATEST } = require('../env/browserstack');

const browserConfig = {
  test_settings: {
    default: {
      desiredCapabilities: {
        ...standardConfig.test_settings.default.desiredCapabilities,
        ...OSX_FIREFOX_LATEST,
      },
    },
  },
};
const output = { ...standardConfig, ...browserConfig };
console.log(JSON.stringify(output));
module.exports = output;
