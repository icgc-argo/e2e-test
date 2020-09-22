import { submitResults, startAsUser, buildUrl, TEST_USERS, createEgoCookie } from '../../helpers';
import { BaseTest, Done } from '../../types';
import { NightwatchBrowser, NightwatchCallbackResult } from 'nightwatch';
import { addProgramPermissions } from '../../utils/user';
import { generateProgram, createProgram } from '../../utils/programUtils';
import { multiSelectClick } from '../../utils/formUtils';
import { invert } from 'lodash';

const program = generateProgram();
console.log('program', program);
program.shortName = 'Z379254-CA';

const MAILHOG_ROOT = process.env.MAILHOG_ROOT || '';

const getInviteId = (result: any): string => {
  // const value = result.value ? result.value : '';
  //  const matches = value.match(/[^\/]*$/);
  //  return matches ? matches[0] : '';
  return '';
};

const DEFAULT_TIMEOUT = 30000;
const TT = 100;

const JoinProgramTest: BaseTest = {
  '@disabled': false,
  developer: 'Ciaran Schutte',
  tags: ['programs', 'join-program'],
  desiredCapabilities: {
    name: 'Manage Programs',
  },

  before: async (browser: NightwatchBrowser, done: Done) => {
    //await createProgram({ jwt: TEST_USERS.DCC_ADMIN.token, program });
    done();
  },

  /**
   * DCC Admin inviting Program Admin Single
   */
  'Join a Program': async (browser: NightwatchBrowser) => {
    // adds user
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .url(buildUrl(`/submission/program/${program.shortName}/manage?activeTab=users`))

      /**
       * Loading overlay causes clicks to be intercepted
       * loading overlay is not reliably visible either
       * need a better way for this
       *  .waitForElementPresent('#global-loader-view')
       *  .waitForElementNotPresent('#global-loader-view')
       */

      .pause(5000)

      .waitForElementVisible('#add-users', DEFAULT_TIMEOUT)
      .click('#add-users')

      //@ts-ignore (custom commands aren't covered by NS types)
      .customSetValue('[aria-label="First name"]', 'admin')
      .customSetValue('[aria-label="Last name"]', 'single')
      .customSetValue('[aria-label="Email"]', TEST_USERS.PROGRAM_ADMIN_SINGLE.email)

      .click('select[aria-label="Select role"] + div[role="button"')
      .click('ol[role="listbox"] li[data-value="ADMIN"]')
      .click('#modal-add-users');

    // tests if email was sent to mailhog
    browser
      .pause(10000) // allows time for email to reach mailhog
      .url(MAILHOG_ROOT)
      .useXpath()
      // make sure the email matches rather than just clicking first email
      .click(`//div[contains(text(), '${TEST_USERS.PROGRAM_ADMIN_SINGLE.email}')][1]`)

      // async is broke, callback hell for now: https://github.com/nightwatchjs/nightwatch/issues/2294

      //const elFrameId= {ELEMENT: frameId}
      .frame('preview-html', res => {
        browser.getAttribute(
          "//a[contains(text(), 'JOIN THE PROGRAM')]",
          'href',
          (result: NightwatchCallbackResult<string | null>) => {
            const inviteId = getInviteId(result);
            console.log('invite id', inviteId);
            browser
              .url(buildUrl(`/submission/program/join/login/${inviteId}`))
              .waitForElementVisible(`//*[contains(text(), 'Log in with Google')]`)
              .useCss()
              .deleteCookies()
              .perform((done: Done) => {
                startAsUser(browser)(TEST_USERS.PROGRAM_ADMIN_SINGLE);
                done();
              })
              .url(buildUrl(`/submission/program/join/details/${inviteId}`))
              .waitForElementVisible('#join-now', DEFAULT_TIMEOUT)
              .perform(() =>
                multiSelectClick(browser)('#institution-multiselect', ['Aarhus University']),
              )
              .setValue('[aria-label="first-name-input"]', 'e2e')
              .setValue('[aria-label="last-name-input"]', 'test')
              .setValue('[aria-label="department-input"]', 'oicr')
              .pause()
              // update cookie gets set in Join Now, have to add permissions to avoid custom cookie been overwritten
              .click('#join-now')
              .perform((done: Done) => {
                const token = addProgramPermissions(TEST_USERS.PROGRAM_ADMIN_SINGLE.token, [
                  `${program.shortName}-ADMIN`,
                ]);
                const cookie = createEgoCookie(token);
                browser.setCookie(cookie);
                done();
              })
              .url(buildUrl(`/submission/program/${program.shortName}/dashboard`))
              .pause()
              .useXpath()
              .waitForElementVisible(
                `//*[contains(text(), 'Welcome to ${program.shortName}!')]`,
                10000,
              )
              .end();
          },
        );
      });
  },

  'Join a Program with wrong email': (browser: NightwatchBrowser) => {
    // adds user
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .url(buildUrl(`/submission/program/${program.shortName}/manage?tab=users`))
      .waitForElementVisible('#add-users')
      .click('#add-users')
      .setValue('[aria-label="First name"]', 'admin')
      .setValue('[aria-label="Last name"]', 'single')
      .setValue('[aria-label="Email"]', TEST_USERS.PROGRAM_ADMIN_MULTI.email)
      .click('#modal-add-users');

    // tests if email was sent to mailhog
    browser
      .pause(10000) // allows time for email to reach mailhog
      .url(MAILHOG_ROOT)
      .pause()
      .useXpath()
      .click(`//div[contains(text(), '${TEST_USERS.PROGRAM_ADMIN_MULTI.email}')][1]`)
      .frame('preview-html', () => {
        browser
          .useXpath()
          .getAttribute("//a[contains(text(), 'JOIN THE PROGRAM')]", 'href', result => {
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
