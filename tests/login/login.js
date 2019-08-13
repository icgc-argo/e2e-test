<<<<<<< Updated upstream
const { updateStatus, visitPath } = require('../../helpers');
=======
const { updateStatus, buildUrl, loginAsUser, TEST_USERS } = require('../../helpers');
>>>>>>> Stashed changes

module.exports = {
  desiredCapabilities: {
    name: 'Login',
  },

<<<<<<< Updated upstream
  'User page exists': browser => {
    visitPath(browser)('/')
      .waitForElementVisible('body')
      .assert.containsText('h1', 'Welcome to Argo!')
=======
  'Login as DCC Admin': browser => {
    loginAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .assert.urlEquals(
        buildUrl('submission/program'),
        'DCC Admin was redirected to the All Programs page after login',
      )
>>>>>>> Stashed changes
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
