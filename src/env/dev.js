const CHROME_LATEST = {
  webdriver: {
    start_process: true,
    server_path: 'chromedriver',
    port: 9515,
  },
  desiredCapabilities: {
    browserName: 'Chrome',
  },
};

const FIREFOX_LATEST = {
  webdriver: {
    start_process: true,
    server_path: 'geckodriver',
  },
  desiredCapabilities: {
    browserName: 'Firefox',
  },
};

const env = {
  CHROME_LATEST,
  FIREFOX_LATEST,
};

module.exports = env;
