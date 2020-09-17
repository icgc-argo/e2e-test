const { CHROME_LATEST } = require('../env/dev');
const path = require('path');
require('dotenv').config();

const config = {
  src_folders: ['../tests'],
  output_folder: './test_reports',

  // custom_commands_path: './commands',

  webdriver: {
    start_process: true,
    server_path: 'node_modules/geckodriver/bin/geckodriver',
    port: 9515,
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'firefox',
        loggingPrefs: { browser: 'ALL' },
      },
    },
  },
};

module.exports = config;
