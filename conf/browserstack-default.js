const { OSX_CHROME_LATEST } = require('../env/browserstack');

const commonCapabilities = {
  'browserstack.user': process.env.BROWSERSTACK_USER,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
  'browserstack.local': 'true',
  'browserstack.networkLogs': 'true',
  'browserstack.debug': 'true',
  'browserstack.networkLogs': 'true',
  'browserstack.console': 'info',
  project: process.env.BROWSERSTACK_PROJECT_NAME,
  host: process.env.BROWSERSTACK_SELENIUM_HOST,
  port: 443,
  ...OSX_CHROME_LATEST,
};

const config = {
  custom_commands_path: './commands',
  src_folders: ['../tests/programs'],
  output_folder: './test_reports',
  selenium: {
    start_process: false,
    host: process.env.BROWSERSTACK_SELENIUM_HOST,
    port: process.env.BROWSERSTACK_SELENIUM_PORT,
  },

  test_settings: {
    default: { desiredCapabilities: commonCapabilities },
  },
};

module.exports = config;
