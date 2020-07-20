import { submitResults, startAsUser, buildUrl, TEST_USERS } from '../../helpers';
import { BaseTest } from '../../types';
import { NightwatchBrowser, NightwatchCallbackResult } from 'nightwatch';

const { generateProgram, createProgram } = require('../../utils/programUtils');

const { multiSelectClick } = require('../../utils/formUtils');

const program = generateProgram();

const MAILHOG_ROOT = process.env.MAILHOG_ROOT || '';

const getInviteId = (result: NightwatchCallbackResult<string | null>): string => {
  const value = result.value ? (result.value as string) : '';
  const matches = value.match(/[^\/]*$/);
  return matches ? matches[0] : '';
};

const JoinProgramTest: BaseTest = {
  '@disabled': true,
  developer: 'Ciaran Schutte',
  tags: ['programs', 'join-program'],
  desiredCapabilities: {
    name: 'Manage Programs',
  },

  before: async () => {
    await createProgram({ jwt: TEST_USERS.DCC_ADMIN.token, program });
  },

  'Join a Program': (browser: NightwatchBrowser) => {
    // adds user
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .url(buildUrl(`/submission/program/${program.shortName}/manage?activeTab=users`))
      .waitForElementVisible('#add-users')
      .click('#add-users')
      .setValue('[aria-label="First name"]', 'admin')
      .setValue('[aria-label="Last name"]', 'single')
      .setValue('[aria-label="Email"]', TEST_USERS.PROGRAM_ADMIN_SINGLE.email)
      .click('#modal-add-users');

    // tests if email was sent to mailhog
    browser
      .pause(10000) // allows time for email to reach mailhog
      .url(MAILHOG_ROOT)
      .useXpath()
      .click(`//div[contains(text(), '${TEST_USERS.PROGRAM_ADMIN_SINGLE.email}')][1]`)
      .frame('preview-html', () => {
        browser.getAttribute(
          "//a[contains(text(), 'JOIN THE PROGRAM')]",
          'href',
          (result: NightwatchCallbackResult<string | null>) => {
            const inviteId = getInviteId(result);
            console.log(inviteId);
            browser
              .url(buildUrl(`/submission/program/join/login/${inviteId}`))
              .useXpath()
              .waitForElementVisible(`//*[contains(text(), 'Log in with Google')]`)
              .useCss()
              .deleteCookies()
              .perform(() => startAsUser(browser)(TEST_USERS.PROGRAM_ADMIN_SINGLE))
              .pause(1000) //wait for login issues to settle
              .url(buildUrl(`/submission/program/join/details/${inviteId}`))
              .waitForElementVisible('#join-now', 10000)
              .perform(() =>
                multiSelectClick(browser)('#institution-multiselect', ['Aarhus University']),
              )
              .setValue('[aria-label="first-name-input"]', 'e2e')
              .setValue('[aria-label="last-name-input"]', 'test')
              .setValue('[aria-label="department-input"]', 'oicr')
              .click('#join-now')
              .pause(10000)
              .useXpath()
              .waitForElementVisible(
                `//*[contains(text(), 'Welcome to ${program.shortName}!')]`,
                10000,
              )
              .useCss()
              .end();
          },
        );
      });
  },

  'Join a Program with wrong email': (browser: NightwatchBrowser) => {
    // adds user
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .url(buildUrl(`/submission/program/${program.shortName}/manage?tab=users`))
      .click('#add-users')
      .setValue('[aria-label="First name"]', 'admin')
      .setValue('[aria-label="Last name"]', 'single')
      .setValue('[aria-label="Email"]', TEST_USERS.PROGRAM_ADMIN_MULTI.email)
      .click('#modal-add-users');

    // tests if email was sent to mailhog
    browser
      .pause(10000) // allows time for email to reach mailhog
      .url(MAILHOG_ROOT)
      .useXpath()
      .click(`//div[contains(text(), '${TEST_USERS.PROGRAM_ADMIN_MULTI.email}')][1]`)
      .frame('preview-html', () => {
        browser.getAttribute("//a[contains(text(), 'JOIN THE PROGRAM')]", 'href', result => {
          const inviteId = getInviteId(result);
          browser
            .url(buildUrl(`/submission/program/join/login/${inviteId}`))
            .useXpath()
            .waitForElementVisible(`//*[contains(text(), 'Log in with Google')]`)
            .useCss()
            .deleteCookies()
            .perform(() => startAsUser(browser)(TEST_USERS.PROGRAM_ADMIN_SINGLE))
            .url(buildUrl(`/submission/program/join/details/${inviteId}`))
            .useXpath()
            .waitForElementVisible(`//*[contains(text(), 'Incorrect email address')]`)
            .useCss()
            .end();
        });
      });
  },

  after: (browser, done) => submitResults(browser, done),
};

export = JoinProgramTest;
