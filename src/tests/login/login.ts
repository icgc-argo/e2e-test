import { BaseTest } from '../../types';
import { submitResults, buildUrl, TEST_USERS, visitPath, startAsUser } from '../../helpers';
import { NightwatchBrowser } from 'nightwatch';

/**
 * Log in flow with Chrome auth can't be test due to multi factor authentication and other security features
 * We can just test that our login link gets us to chrome and we have a certain user when we have a certain cookie
 */
const LoginTest: BaseTest = {
  '@disabled': false,
  developer: 'Ciaran Schutte',
  tags: ['login'],
  desiredCapabilities: {
    name: 'Login :: Ciaran Schutte',
  },

  'Ensure login link goes to Google SSO': (browser: NightwatchBrowser) => {
    visitPath(browser)('/')
      .waitForElementVisible('#link-login')
      .click('#link-login')
      .waitForElementVisible('input[type="email"]');
  },

  'Login as DCC Admin': (browser: NightwatchBrowser) => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .assert.urlEquals(
        buildUrl('submission/program'),
        'DCC Admin was redirected to the All Programs page after login',
      )
      .end();
  },

  // /user is startpath
  'Login as Program Admin Single': (browser: NightwatchBrowser) => {
    startAsUser(browser)(TEST_USERS.PROGRAM_ADMIN_SINGLE)
      .assert.urlContains('submission/program')
      .assert.urlContains('dashboard')
      .end();
  },

  after: (browser, done) => submitResults(browser, done),
};

export = LoginTest;
