import { BaseTest, Done } from '../../types';
import { startAsUser, buildUrl, TEST_USERS, submitResults } from '../../helpers';
import {
  generateProgram,
  createProgram,
  registerSamples,
  submitClinicalData,
} from '../../utils/programUtils';
import { NightwatchBrowser } from 'nightwatch';

const program = generateProgram();

const ClinicalSubmissionTest: BaseTest = {
  '@disabled': false,
  developer: 'Ciaran Schutte',
  tags: ['programs', 'clinical-submission'],
  desiredCapabilities: {
    name: 'Registration :: Ciaran Schutte',
  },

  before: async (browser: NightwatchBrowser, done) => {
    createProgram({ jwt: TEST_USERS.DCC_ADMIN.token, program }).then(d => {
      done();
    });
  },

  'Register - Empty State': (browser: NightwatchBrowser) => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN).url(
      buildUrl(`/submission/program/${program.shortName}/sample-registration`),
    );

    browser
      .waitForElementVisible('#button-register-file-select', 2000)
      .assert.visible('#button-register-file-select')
      .expect.element('#button-register-samples-commit')
      .to.have.attribute('disabled');
  },

  'Register - Upload Samples and Clear': (browser: NightwatchBrowser) => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async (done: Done) => {
        await registerSamples({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
        });
        done();
      })
      .pause(2500)
      .url(buildUrl(`/submission/program/${program.shortName}/sample-registration`));

    browser.pause(2500);
    browser.expect.element('#button-register-clear-file').to.be.visible;
    browser.expect.element('#button-register-samples-commit').to.not.have.attribute('disabled');

    browser.click('#button-register-clear-file').pause(2500);
    browser.expect.element('#button-register-samples-commit').to.have.attribute('disabled');
  },

  'Register - Upload and Commit': (browser: NightwatchBrowser) => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async (done: Done) => {
        await registerSamples({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
        });
        done();
      })
      .pause(2500)
      .url(buildUrl(`/submission/program/${program.shortName}/sample-registration`));
    browser.pause(2500);
    browser
      .click('#button-register-samples-commit')
      .pause(2500)
      .waitForElementVisible('#modal-confirm-register')
      .click('#modal-confirm-register')
      .pause(4000);
    browser.expect.element('.toastStackContainer').text.to.contain('new registered samples');
    browser.assert.urlEquals(buildUrl(`submission/program/${program.shortName}/dashboard`));
  },

  'Submission - Empty State': (browser: NightwatchBrowser) => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN).url(
      buildUrl(`/submission/program/${program.shortName}/clinical-submission`),
    );
    browser.waitForElementVisible('#button-submission-file-select');
    browser.assert.visible('#button-submission-file-select');
    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.have.attribute('disabled');
  },

  'Submission - Upload Good Clinical Data and Clear Submission': (browser: NightwatchBrowser) => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async (done: Done) => {
        await submitClinicalData({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          good: true,
        });
        done();
      })
      .url(buildUrl(`/submission/program/${program.shortName}/clinical-submission`));

    browser
      .waitForElementVisible('#button-validate-submission')
      .waitForElementVisible('#button-submission-sign-off')
      .waitForElementVisible('#button-clear-submission');

    browser.expect.element('#button-validate-submission').to.not.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser.click('#button-clear-submission');
    browser
      .waitForElementVisible('.toastStackContainer')
      .expect.element('.toastStackContainer')
      .text.to.contain('Submission cleared');

    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.have.attribute('disabled');
  },

  'Submission - Upload Good Clinical Data, Validate and Signoff': (browser: NightwatchBrowser) => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async (done: Done) => {
        await submitClinicalData({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          good: true,
        });
        done();
      })
      .pause(2000)
      .url(buildUrl(`/submission/program/${program.shortName}/clinical-submission`));

    browser.expect.element('#button-validate-submission').to.not.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser.click('#button-validate-submission');

    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.not.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser
      .click('#button-submission-sign-off')
      .waitForElementVisible('#modal-confirm-sign-off')
      .click('#modal-confirm-sign-off');

    browser.expect
      .element('.toastStackContainer')
      .text.to.contain('Successful Clinical Submission!');
    browser.assert.urlEquals(buildUrl(`submission/program/${program.shortName}/dashboard`));
  },

  'Submission - No Data Updates Signoff': (browser: NightwatchBrowser) => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async (done: Done) => {
        await submitClinicalData({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          good: true,
        });
        done();
      })
      .pause(2500)
      .url(buildUrl(`/submission/program/${program.shortName}/clinical-submission`));

    browser.expect.element('#button-validate-submission').to.not.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser.click('#button-validate-submission').pause(2000);

    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.not.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser
      .click('#button-submission-sign-off')
      .waitForElementVisible('#modal-confirm-sign-off')
      .click('#modal-confirm-sign-off');

    browser
      .waitForElementVisible('.toastStackContainer')
      .expect.element('.toastStackContainer')
      .text.to.contain('Successful Clinical Submission!');

    browser.assert.urlEquals(buildUrl(`submission/program/${program.shortName}/dashboard`));
  },

  /*
  *
  * Broken test, after file upload via API there is nothing on the UI
  'Submission - Full End to End': (browser: NightwatchBrowser) => {
    // Test Order:
    // Submission -
    // Upload Bad Clinical Data,
    // Clear Selected File Upload,
    // Validate Error,
    // Clear Selected File,
    // Validate,
    // SignOff,
    // Reopen,
    // Validate,
    // SignOff,
    // Approve

    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async (done: Done) => {
        await submitClinicalData({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          good: false,
        });
        done();
      })
      .url(buildUrl(`/submission/program/${program.shortName}/clinical-submission`));

    browser.pause();
    browser.expect.element('#button-validate-submission').to.not.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser.click('#button-validate-submission');
    browser.pause();

    browser.expect
      .element('#error-submission-sign-off')
      .text.to.contain('found in submission workspace');
    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');
    browser.assert.visible('#button-clear-selected-file');

    browser.click('#button-clear-selected-file').pause(2500);

    browser.expect.element('.toastStackContainer').text.to.contain('Cleared');
    browser.expect.element('#button-validate-submission').to.not.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser.click('#button-validate-submission').pause(2500);

    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.not.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser
      .click('#button-submission-sign-off')
      .pause(2500)
      .waitForElementVisible('#modal-confirm-sign-off')
      .click('#modal-confirm-sign-off')
      .pause(4000);

    browser.assert.visible('#button-reopen');
    browser.assert.visible('#button-approve');

    browser
      .click('#button-reopen')
      .pause(2500)
      .waitForElementVisible('#modal-confirm-reopen')
      .click('#modal-confirm-reopen')
      .pause(4000);

    browser.expect.element('#button-validate-submission').to.not.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser.click('#button-validate-submission').pause(2000);

    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.not.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser
      .click('#button-submission-sign-off')
      .pause(2500)
      .waitForElementVisible('#modal-confirm-sign-off')
      .click('#modal-confirm-sign-off')
      .pause(4000);

    browser.assert.visible('#button-reopen');
    browser.assert.visible('#button-approve');

    browser
      .click('#button-approve')
      .pause(2500)
      .waitForElementVisible('#modal-confirm-approve')
      .click('#modal-confirm-approve')
      .pause(4000);
    browser.expect
      .element('.toastStackContainer')
      .text.to.contain('Clinical Data is successfully approved');
    browser.assert.urlEquals(buildUrl('submission/dcc/dashboard'));
  },
 */
  after: (browser, done) => submitResults(browser, done),
};

export = ClinicalSubmissionTest;
