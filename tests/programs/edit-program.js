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
      /**
       * Commitment level is Number, using Nightwatch setValue(string) will break it
       *
       * 'execute' doesn't support anon function https://github.com/nightwatchjs/nightwatch/issues/1920
       */
      /*  .execute(function() {
        var el = document.querySelector('#commitment-level');
        parseInt(el.getAttribute('value')) > 10 ? el.stepDown() : el.stepUp();
        return true;
      }, [])
      */ .perform(
        () => selectClick(page)('#membership-type', programEdits.membershipType),
      )
      .keyClearValue('#website')
      .setValue('#website', programEdits.website)
      .setValue('#description', ' EDIT')
      .perform(() => multiSelectClick(page)('#institutions-multiselect', programEdits.institutions))
      .perform(() =>
        multiCheckboxClick(page)('#checkbox-group-processing-regions', programEdits.regions),
      )
      .click('#button-submit-edit-program-form');

    browser.expect.element('.toastStackContainer').text.to.contain('Success!');
    browser.assert.urlEquals(
      buildUrl(`/submission/program/${program.shortName}/manage?activeTab=profile`),
    );

    browser.expect.element('#button-submit-edit-program-form').to.have.attribute('disabled');
  },
};
