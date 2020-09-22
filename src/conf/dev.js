const { CHROME_LATEST } = require('../env/dev');
const path = require('path');
require('dotenv').config();

const config = {
  src_folders: ['../tests'],
  output_folder: './test_reports',

  // TODO: consider a higher level config, specifying 'build' here isn't perfect
  custom_commands_path: './build/commands',

  webdriver: {
    start_process: true,
    // server_path: 'node_modules/geckodriver/bin/geckodriver',
    server_path: 'node_modules/chromedriver/bin/chromedriver',

    port: 9515,
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'chrome',
        loggingPrefs: { browser: 'ALL' },
      },
    },
  },
};

module.exports = config;
