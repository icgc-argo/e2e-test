const assert = require('assert');

const { startAsUser, buildUrl, TEST_USERS } = require('../../helpers');

const {
  generateProgram,
  createProgram,
  registerSamples,
  submitClinicalData,
} = require('../../utils/programUtils');

//const program = generateProgram();
const program = { shortName: 'Z1801878-CA' };

module.exports = {
  '@disabled': true,
  tags: ['programs', 'clinical-submission'],
  desiredCapabilities: {
    name: 'Registration',
  },

  before: !function(browser, done) {
    return createProgram({ jwt: TEST_USERS.DCC_ADMIN.token, program }).then(() => {
      done();
    });
  },

  'Register - Empty State': function(browser) {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN).url(
      buildUrl(`/submission/program/${program.shortName}/sample-registration`),
    );

    browser
      .waitForElementVisible('#button-register-file-select', 2000)
      .assert.visible('#button-register-file-select')
      .expect.element('#button-register-samples-commit')
      .to.have.attribute('disabled');
  },

  'Register - Upload Samples and Clear': function(browser) {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async function(done) {
        await registerSamples({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
        });
        done();
      })
      .url(buildUrl(`/submission/program/${program.shortName}/sample-registration`));

    browser.waitForElementVisible('#button-register-clear-file');
    browser.expect.element('#button-register-samples-commit').to.not.have.attribute('disabled');
    browser.assert
      .visible('#button-register-clear-file')
      .click('#button-register-clear-file')
      .assert.visible('#button-register-samples-commit:disabled');
  },

  'Register - Upload and Commit': function(browser) {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async function(done) {
        await registerSamples({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
        });
        done();
      })
      .url(buildUrl(`/submission/program/${program.shortName}/sample-registration`));

    browser
      .waitForElementVisible('#button-register-samples-commit:enabled', 2000)
      .click('#button-register-samples-commit')
      .waitForElementVisible('#modal-confirm-register')
      .click('#modal-confirm-register');

    browser.expect
      .element('.toastStackContainer')
      // title: `${num} new registered ${pluralize('sample', num)}`,
      .text.to.contain('new registered');

    browser.assert.urlEquals(buildUrl(`submission/program/${program.shortName}/dashboard`));
  },

  'Submission - Empty State': function(browser) {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN).url(
      buildUrl(`/submission/program/${program.shortName}/clinical-submission`),
    );

    browser.assert.visible('#button-submission-file-select');
    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.have.attribute('disabled');
  },

  'Submission - Upload Good Clinical Data and Clear Submission': function(browser) {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async function(done) {
        await submitClinicalData({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          good: true,
        });
        done();
      })
      .pause(2500)
      .url(buildUrl(`/submission/program/${program.shortName}/clinical-submission`));

    browser
      .waitForElementVisible('#button-validate-submission')
      .waitForElementVisible('#button-submission-sign-off')
      .waitForElementVisible('#button-clear-submission');

    browser.expect.element('#button-validate-submission').to.not.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser.click('#button-clear-submission').pause(2500);

    browser.expect.element('.toastStackContainer').text.to.contain('Submission cleared');
    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.have.attribute('disabled');
  },

  /**
   * Note: Samples have to be registered in previous steps already
   */
  'Submission - Upload Good Clinical Data, Validate, and Signoff': function(browser) {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async function(done) {
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

    browser.click('#button-validate-submission').pause(undefined);

    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.not.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser
      .click('#button-submission-sign-off')
      .pause(2500)
      .waitForElementVisible('#modal-confirm-sign-off')
      .click('#modal-confirm-sign-off')
      .pause(4000);
    browser.expect
      .element('.toastStackContainer')
      .text.to.contain('Successful Clinical Submission!');
    browser.assert.urlEquals(buildUrl(`submission/program/${program.shortName}/dashboard`));
  },

  'Submission - No Data Updates Signoff': !function(browser) {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async () => {
        await submitClinicalData({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          good: 'true',
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
      .pause(2500)
      .waitForElementVisible('#modal-confirm-sign-off')
      .click('#modal-confirm-sign-off')
      .pause(4000);
    browser.expect
      .element('.toastStackContainer')
      .text.to.contain('Successful Clinical Submission!');
    browser.assert.urlEquals(buildUrl(`submission/program/${program.shortName}/dashboard`));
  },

  'Submission - Full End to End': !function(browser) {
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
      .perform(async function(done) {
        await submitClinicalData({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          good: false,
        });
        done();
      })
      .pause(2500)
      .url(buildUrl(`/submission/program/${program.shortName}/clinical-submission`));
    browser.pause(2500);
    browser.expect.element('#button-validate-submission').to.not.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser.click('#button-validate-submission').pause(2500);

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
};
