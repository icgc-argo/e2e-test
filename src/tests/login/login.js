const { afterEach, updateStatus, buildUrl, loginAsUser, TEST_USERS } = require('../../helpers');

module.exports = {
  tags: ['login'],
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

  'Login as DCC Admin': browser => {
    loginAsUser(browser)(TEST_USERS.PROGRAM_ADMIN_SINGLE)
      .assert.urlContains('submission/program')
      .assert.urlContains('dashboard')
      .end();
  },
};
