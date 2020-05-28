const assert = require('assert');

const { buildUrl, TEST_USERS, startAsUser } = require('../../helpers');

const { generateProgram, generateProgram2, createProgram } = require('../../utils/programUtils');
const { multiSelectClick, selectClick, multiCheckboxClick } = require('../../utils/formUtils');

const program = generateProgram();
const programEdits = generateProgram2();

module.exports = {
  tags: ['programs', 'edit-program'],
  desiredCapabilities: {
    name: 'Manage Programs',
  },

  before: async browser => {
    await createProgram({ jwt: TEST_USERS.DCC_ADMIN.token, program });
  },

  'Edit Program': browser => {
    // As DCCAdmin, lets navigate to the create form page
    const page = startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .pause(2000)
      .url(buildUrl(`/submission/program/${program.shortName}/manage?activeTab=profile`));

    // Fill Form and Submit
    browser.assert.urlEquals(
      buildUrl(`/submission/program/${program.shortName}/manage?activeTab=profile`),
    );
    browser.pause(4000);
    browser.expect.element('#button-submit-edit-program-form').to.have.attribute('disabled');
    page
      .setValue('#program-name', ' EDIT')
      .perform(() => multiSelectClick(page)('#countries-multiselect', programEdits.countries))
      .getAttribute('#button-submit-edit-program-form', 'disabled', function(result) {
        this.assert.equal(result.value, null);
      })
      .perform(() => multiSelectClick(page)('#cancer-types-multiselect', programEdits.cancerTypes))
      .perform(() =>
        multiSelectClick(page)('#primary-sites-multiselect', programEdits.primarySites),
      )
      .setValue('#commitment-level', programEdits.commitmentDonors)
      .perform(() => selectClick(page)('#membership-type', programEdits.membershipType))
      //.setValue('#website', programEdits.website)
      .perform(() => multiSelectClick(page)('#institutions-multiselect', programEdits.institutions))
      .perform(() =>
        multiCheckboxClick(page)('#checkbox-group-processing-regions', programEdits.regions),
      );
    browser.pause(4000);
    page.click('#button-submit-edit-program-form');
    browser.pause(4000);
    browser.expect.element('#button-submit-edit-program-form').to.have.attribute('disabled');
    browser.expect.element('.toastStackContainer').text.to.contain('Success!');
    browser.assert.urlEquals(
      buildUrl(`/submission/program/${program.shortName}/manage?activeTab=profile`),
    );
  },
};
