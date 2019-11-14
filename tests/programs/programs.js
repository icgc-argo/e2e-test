const assert = require('assert');
const urlJoin = require('url-join');
const { orderBy } = require('lodash');

const {
  runGqlQuery,
  buildUrl,
  visitPath,
  TEST_USERS,
  updateStatus,
  performWithValues,
  startAsUser,
} = require('../../helpers');

const { generateProgram } = require('../../utils/programUtils');
const { multiSelectClick, selectClick, multiCheckboxClick } = require('../../utils/formUtils');

const program = generateProgram();

module.exports = {
  tags: ['programs'],
  desiredCapabilities: {
    name: 'Manage Programs',
  },

  'Create New Program': browser => {
    // As DCCAdmin, lets navigate to the create form page
    const page = startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .waitForElementVisible('#primary-action-create-program')
      .click('#primary-action-create-program')
      .waitForElementVisible('form[name=createProgram]')
      .assert.urlEquals(buildUrl('submission/program/create'));

    // Fill Form and Submit
    page
      .setValue('#program-name', program.name)
      .setValue('#short-name', program.shortName)
      .perform(() => multiSelectClick(page)('#countries-multiselect', program.countries))
      .perform(() => multiSelectClick(page)('#cancer-types-multiselect', program.cancerTypes))
      .perform(() => multiSelectClick(page)('#primary-sites-multiselect', program.primarySites))
      .setValue('#commitment-level', program.commitment)
      .perform(() => selectClick(page)('#membership-type', program.membershipType))
      .setValue('#website', program.website)
      .setValue('#description', program.description)
      .perform(() => multiSelectClick(page)('#institutions-multiselect', program.insitutions))
      .perform(() =>
        multiCheckboxClick(page)('#checkbox-group-processing-regions', program.regions),
      )
      .setValue('#first-name', program.piFirstName)
      .setValue('#last-name', program.piLastName)
      .setValue('#email', program.piEmail)
      .click('#button-submit-create-program-form');

    // Ensure success:
    // Navigate to program list, look for success toast, ensure that our new program is in the program list
    page
      .waitForElementVisible('#primary-action-create-program', 20000)
      .assert.urlEquals(buildUrl('submission/program'))
      .useXpath()
      .waitForElementVisible(
        `//div[@class='MenuItemContent']//button[contains(text(), ${program.shortName})]`,
      )
      .useCss()
      .end();
  },

  'Join a Program with wrong email': browser => {
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
  },

  'Join a Program': browser => {
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
            .perform(() => startAsUser(browser)(TEST_USERS.PROGRAM_ADMIN_SINGLE))
            .url(buildUrl(`/submission/program/join/details/${inviteId}`))
            .waitForElementVisible('#join-now', 10000)
            .perform(() =>
              multiSelectClick(browser)('#institution-multiselect', ['Aarhus University']),
            )
            .setValue('[aria-label="first-name-input"]', 'e2e')
            .setValue('[aria-label="last-name-input"]', 'test')
            .setValue('[aria-label="department-input"]', 'oicr')
            .click('#join-now')
            .useXpath()
            .waitForElementVisible(
              `//*[contains(text(), 'Welcome to ${program.shortName}!')]`,
              10000,
            )
            .useCss()
            .end();
        });
      });
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
