const assert = require('assert');
const urlJoin = require('url-join');
const { orderBy } = require('lodash');

const {
  runGqlQuery,
  buildUrl,
  visitPath,
  startAsUser,
  TEST_USERS,
  updateStatus,
  performWithValues,
  loginAsUser,
} = require('../../helpers');

const { generateProgram } = require('../../utils/programUtils');
const { multiSelectClick, selectClick, multiCheckboxClick } = require('../../utils/formUtils');

const program = generateProgram();

const waitForElementContainingText = page => (text, elementTag = '*', timeout = 10000) => {
  return page
    .useXpath()
    .waitForElementVisible(`//${elementTag}[contains(text(), '${text}')][1]`, timeout)
    .useCss();
};

module.exports = {
  tags: ['programs'],
  desiredCapabilities: {
    name: 'Manage Programs',
  },

  'Create New Program': browser => {
    // As DCCAdmin, lets navigate to the create form page
    const page = loginAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .waitForElementVisible('#primary-action-create-program')
      .click('#primary-action-create-program')
      .waitForElementVisible('form[name=createProgram]')
      .assert.urlEquals(buildUrl('submission/program/create'));

    // Fill Form and Submit
    waitForElementContainingText(page)('All Programs')
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
      .perform(() => {
        performWithValues(browser)('div.MenuItemContent button', menuItems =>
          assert.ok(menuItems.includes(program.shortName), 'Program Found in List'),
        );
      })
      .end();
  },

  'Join a Program with wrong email': browser => {
    let inviteId;

    loginAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .url(buildUrl(`/submission/program/${program.shortName}/manage?tab=users`))
      .click('#add-users')
      .setValue('[aria-label="First name"]', 'admin')
      .setValue('[aria-label="Last name"]', 'single')
      .setValue('[aria-label="Email"]', TEST_USERS.PROGRAM_ADMIN_SINGLE.email)
      .click('#modal-add-users');

    browser
      .url(process.env.MAILHOG_ROOT)
      .click('xpath', `//div[contains(text(), '${TEST_USERS.PROGRAM_ADMIN_SINGLE.email}')][1]`)
      .frame('preview-html', function() {
        this.getAttribute('xpath', "//a[contains(text(), 'JOIN THE PROGRAM')]", 'href', r => {
          inviteId = r.value.match(/[^\/]*$/)[0];
          this.url(buildUrl(`/submission/program/join/login/${inviteId}`))
            .waitForElementVisible('#google-login', 10000)
            .click('#google-login')
            .deleteCookies()
            .refresh()
            .waitForElementVisible('input[type="email"]')
            .setValue('input[type="email"]', TEST_USERS.PROGRAM_ADMIN_MULTI.email)
            .click('#identifierNext')
            .waitForElementVisible('input[type="password"]')
            .setValue('input[type="password"]', TEST_USERS.PROGRAM_ADMIN_MULTI.pass)
            .click('#passwordNext')
            .useXpath()
            .waitForElementVisible(`//*[contains(text(), 'Incorrect email address')]`);
        });
      })
      .end();
  },

  'Join a Program': browser => {
    let inviteId;

    loginAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .url(buildUrl(`/submission/program/${program.shortName}/manage?tab=users`))
      .click('#add-users')
      .setValue('[aria-label="First name"]', 'admin')
      .setValue('[aria-label="Last name"]', 'single')
      .setValue('[aria-label="Email"]', TEST_USERS.PROGRAM_ADMIN_SINGLE.email)
      .click('#modal-add-users');

    browser
      .url(process.env.MAILHOG_ROOT)
      .click('xpath', `//div[contains(text(), '${TEST_USERS.PROGRAM_ADMIN_SINGLE.email}')][1]`)
      .frame('preview-html', function() {
        this.getAttribute('xpath', "//a[contains(text(), 'JOIN THE PROGRAM')]", 'href', r => {
          inviteId = r.value.match(/[^\/]*$/)[0];
          this.url(buildUrl(`/submission/program/join/login/${inviteId}`))
            .waitForElementVisible('#google-login', 10000)
            .click('#google-login')
            .deleteCookies()
            .refresh()
            .waitForElementVisible('input[type="email"]')
            .setValue('input[type="email"]', TEST_USERS.PROGRAM_ADMIN_SINGLE.email)
            .click('#identifierNext')
            .waitForElementVisible('input[type="password"]')
            .setValue('input[type="password"]', TEST_USERS.PROGRAM_ADMIN_SINGLE.pass)
            .click('#passwordNext')
            .pause(3000)
            .assert.urlContains('/join/details')
            .perform(() =>
              multiSelectClick(this)('#institution-multiselect', ['Aarhus University']),
            )
            .setValue('[aria-label="first-name-input"]', 'e2e')
            .setValue('[aria-label="last-name-input"]', 'test')
            .setValue('[aria-label="department-input"]', 'oicr')
            .click('#join-now')
            .useXpath()
            .waitForElementVisible(`//*[contains(text(), 'Welcome to')]`);
        });
      })
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
