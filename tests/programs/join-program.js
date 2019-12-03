const assert = require('assert');

const {
  afterEach,
  startAsUser,
  updateStatus,
  buildUrl,
  loginAsUser,
  TEST_USERS,
} = require('../../helpers');

const { generateProgram, createProgram } = require('../../utils/programUtils');
const { multiSelectClick, selectClick, multiCheckboxClick } = require('../../utils/formUtils');

const program = generateProgram();

module.exports = {
  tags: ['programs', 'join-program'],
  desiredCapabilities: {
    name: 'Manage Programs',
  },
  'Join a Program': browser => {
    createProgram({ jwt: TEST_USERS.DCC_ADMIN.token, program });

    // adds user
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .pause(1000) // Make sure create program is complete
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
      .url(process.env.MAILHOG_ROOT)
      .click('xpath', `//div[contains(text(), '${TEST_USERS.PROGRAM_ADMIN_SINGLE.email}')][1]`)
      .frame('preview-html', () => {
        browser.getAttribute('xpath', "//a[contains(text(), 'JOIN THE PROGRAM')]", 'href', r => {
          const inviteId = r.value.match(/[^\/]*$/)[0];
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
            // .perform(() =>
            //   multiSelectClick(browser)('#institution-multiselect', ['Aarhus University']),
            // )
            .setValue('[aria-label="first-name-input"]', 'e2e')
            .setValue('[aria-label="last-name-input"]', 'test')
            .setValue('[aria-label="department-input"]', 'oicr')
            .click('#join-now')
            // .useXpath()
            // .waitForElementVisible(
            //   `//*[contains(text(), 'Welcome to ${program.shortName}!')]`,
            //   10000,
            // )
            // .useCss()
            .end();
        });
      });
  },
  /*'Join a Program with wrong email': browser => {
    // adds user
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .url(buildUrl(`/submission/program/${program.shortName}/manage?tab=users`))
      .click('#add-users')
      .setValue('[aria-label="First name"]', 'admin')
      .setValue('[aria-label="Last name"]', 'single')
      .setValue('[aria-label="Email"]', TEST_USERS.PROGRAM_ADMIN_SINGLE.email)
      .click('#modal-add-users');

    // tests if email was sent to mailhog
    browser
      .pause(10000) // allows time for email to reach mailhog
      .url(process.env.MAILHOG_ROOT)
      .click('xpath', `//div[contains(text(), '${TEST_USERS.PROGRAM_ADMIN_SINGLE.email}')][1]`)
      .frame('preview-html', () => {
        browser.getAttribute('xpath', "//a[contains(text(), 'JOIN THE PROGRAM')]", 'href', r => {
          const inviteId = r.value.match(/[^\/]*$/)[0];
          browser
            .url(buildUrl(`/submission/program/join/login/${inviteId}`))
            .useXpath()
            .waitForElementVisible(`//*[contains(text(), 'Log in with Google')]`)
            .useCss()
            .deleteCookies()
            .perform(() => startAsUser(browser)(TEST_USERS.PROGRAM_ADMIN_MULTI))
            .url(buildUrl(`/submission/program/join/details/${inviteId}`))
            .useXpath()
            .waitForElementVisible(`//*[contains(text(), 'Incorrect email address')]`)
            .useCss()
            .end();
        });
      });
  },*/

  afterEach,
};
