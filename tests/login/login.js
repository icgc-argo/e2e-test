const { updateStatus, visitPath } = require('../../helpers');

module.exports = {
  desiredCapabilities: {
    name: 'Login',
  },

  'User page exists': browser => {
    visitPath(browser)('/')
      .waitForElementVisible('body')
      .assert.containsText('h1', 'Welcome to Argo!')
      .end();
  },

  /*
  "User can login": browser => {
    browser
      .url("http://localhost:8080")
      .waitForElementVisible("body")
      .click("#link-login")
      .waitForElementVisible("#google-log-in")
      .click("#google-log-in");
  },
  */

  afterEach: (browser, done) => {
    const result = browser.currentTest.results;
    // manual failure check for browserstack API call
    if (result.failed > 0) {
      const err = result.lastError.message;
      updateStatus(browser, 'failed', err);
    }
    done();
  },
};
