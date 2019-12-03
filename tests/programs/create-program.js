const assert = require('assert');
const urlJoin = require('url-join');
const { orderBy } = require('lodash');

const {
  afterEach,
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
  tags: ['programs', 'create-program'],
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
      .setValue('#commitment-level', program.commitmentDonors)
      .perform(() => selectClick(page)('#membership-type', program.membershipType))
      .setValue('#website', program.website)
      .setValue('#description', program.description)
      .perform(() => multiSelectClick(page)('#institutions-multiselect', program.institutions))
      .perform(() =>
        multiCheckboxClick(page)('#checkbox-group-processing-regions', program.regions),
      )
      .setValue('#first-name', program.admins[0].firstName)
      .setValue('#last-name', program.admins[0].lastName)
      .setValue('#email', program.admins[0].email)
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

  afterEach,
};
