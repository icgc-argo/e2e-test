import { BaseTest } from '../types';
import { NightwatchBrowser } from 'nightwatch';
import { submitResults } from '../helpers';

/**
 * Test to make sure Browserstack local testing is working
 */
const IsWorkingTest: BaseTest = {
  '@disabled': false,
  developer: 'Ciaran Schutte',
  'BrowserStack Local Testing': (browser: NightwatchBrowser) => {
    browser
      .url('http://bs-local.com:45691/check')
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'Up and running')
      .end();
  },
  after: (browser, done) => submitResults(browser, done),
};

export = IsWorkingTest;
