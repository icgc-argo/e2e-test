const { CHROME_LATEST } = require('../env/dev');
const path = require('path');

const config = {
  src_folders: ['./tests'],
  output_folder: './test_reports',
  webdriver: {
    start_process: true,
    server_path: path.resolve(__dirname, `../node_modules/chromedriver/bin/chromedriver`),
    port: 9515,
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
    },
    CHROME_LATEST,
  },
};

module.exports = config;
