import { submitResults, buildUrl, TEST_USERS, startAsUser } from '../../helpers';

import { generateProgram, createProgram } from '../../utils/programUtils';
import { multiSelectClick, selectClick, multiCheckboxClick } from '../../utils/formUtils';
import { BaseTest, Program, Done } from '../../types';
import { NightwatchBrowser } from 'nightwatch';

const program: Program = generateProgram();
const programEdits: Program = generateProgram({
  commitmentDonors: 4321,
  website: 'https://exampletwo.com',
  institutions: ['Toronto General Hospital'],
  countries: ['Antarctica'],
  regions: ['Canada'],
  cancerTypes: ['Multiple'],
  primarySites: ['Stomach', 'Kidney'],
  membershipType: 'ASSOCIATE',
});

const EditProgramTest: BaseTest = {
  '@disabled': false,
  developer: 'Ciaran Schutte',
  tags: ['programs', 'edit-program'],
  desiredCapabilities: {
    name: 'Manage Programs',
  },

  before: async (browser: NightwatchBrowser, done: Done) => {
    await createProgram({ jwt: TEST_USERS.DCC_ADMIN.token, program });
    done();
  },

  'Edit Program': (browser: NightwatchBrowser) => {
    // As DCCAdmin, lets navigate to the create form page
    const url = buildUrl(`/submission/program/${program.shortName}/manage?activeTab=profile`);

    startAsUser(browser)(TEST_USERS.DCC_ADMIN).url(url);

    // Fill Form and Submit
    browser.assert.urlEquals(url);

    browser
      .waitForElementVisible('#button-submit-edit-program-form')
      .expect.element('#button-submit-edit-program-form')
      .to.have.attribute('disabled');

    browser
      .setValue('#program-name', ' EDIT')
      .perform(() => multiSelectClick(browser)('#countries-multiselect', programEdits.countries))
      .getAttribute('#button-submit-edit-program-form', 'disabled', result => {
        browser.assert.equal(result.value, null);
      })
      .perform(() =>
        multiSelectClick(browser)('#cancer-types-multiselect', programEdits.cancerTypes),
      )
      .perform(() =>
        multiSelectClick(browser)('#primary-sites-multiselect', programEdits.primarySites),
      )
      .setValue('#commitment-level', programEdits.commitmentDonors.toString())
      .perform(() => selectClick(browser)('#membership-type', programEdits.membershipType))
      //.setValue('#website', programEdits.website)
      .perform(() =>
        multiSelectClick(browser)('#institutions-multiselect', programEdits.institutions),
      )
      .perform(() =>
        multiCheckboxClick(browser)('#checkbox-group-processing-regions', programEdits.regions),
      );
    browser.pause(4000);
    browser.click('#button-submit-edit-program-form');
    browser.pause(4000);
    browser.expect.element('#button-submit-edit-program-form').to.have.attribute('disabled');
    browser.expect.element('.toastStackContainer').text.to.contain('Success!');
    browser.assert.urlEquals(
      buildUrl(`/submission/program/${program.shortName}/manage?activeTab=profile`),
    );
  },

  after: (browser, done) => submitResults(browser, done),
};

export = EditProgramTest;
