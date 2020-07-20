import { BaseTest } from '../../types';

import { submitResults, buildUrl, loginAsUser, TEST_USERS } from '../../helpers';
import { NightwatchBrowser } from 'nightwatch';

const LoginTest: BaseTest = {
  '@disabled': true,
  developer: 'Ciaran Schutte',
  tags: ['login'],
  desiredCapabilities: {
    name: 'Login',
  },

  'Login as DCC Admin': (browser: NightwatchBrowser) => {
    loginAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .assert.urlEquals(
        buildUrl('submission/program'),
        'DCC Admin was redirected to the All Programs page after login',
      )
      .end();
  },

  'Login as Program Admin Single': (browser: NightwatchBrowser) => {
    loginAsUser(browser)(TEST_USERS.PROGRAM_ADMIN_SINGLE)
      .assert.urlContains('submission/program')
      .assert.urlContains('dashboard')
      .end();
  },

  after: (browser, done) => submitResults(browser, done),
};

export = LoginTest;
