const { CHROME_LATEST } = require('../env/dev');
const path = require('path');
require('dotenv').config();

const CHROME_DRIVER_PATH = process.env.CHROME_DRIVER_PATH;

const config = {
  src_folders: ['../tests/programs'],
  output_folder: './test_reports',

  //  custom_commands_path: './commands',

  webdriver: {
    start_process: true,
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
    CHROME_LATEST,
  },
};

module.exports = config;
