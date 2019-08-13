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
} = require('../../helpers');

const { generateProgram } = require('../../utils/programUtils');
const { multiSelectClick, selectClick, multiCheckboxClick } = require('../../utils/formUtils');

module.exports = {
  tags: ['programs'],
  desiredCapabilities: {
    name: 'Manage Programs',
  },

  'Create New Program': browser => {
    const program = generateProgram();

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
      .perform(() => {
        performWithValues(browser)('div.MenuItemContent button', menuItems =>
          assert.ok(menuItems.includes(program.shortName), 'Program Found in List'),
        );
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
