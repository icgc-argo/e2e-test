const { updateStatus, buildUrl, loginAsUser, TEST_USERS } = require('../../helpers');

module.exports = {
  desiredCapabilities: {
    name: 'Login',
  },

  'Login as DCC Admin': browser => {
    loginAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .assert.urlEquals(
        buildUrl('submission/program'),
        'DCC Admin was redirected to the All Programs page after login',
      )
      .end();
  },

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
