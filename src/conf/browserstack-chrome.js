const standardConfig = require('./browserstack-default');

const { WINDOWS_CHROME_LATEST } = require('../env/browserstack');

const browserConfig = {
  test_settings: {
    default: {
      desiredCapabilities: {
        ...standardConfig.test_settings.default.desiredCapabilities,
        ...WINDOWS_CHROME_LATEST,
      },
    },
  },
};

module.exports = { ...standardConfig, ...browserConfig };
