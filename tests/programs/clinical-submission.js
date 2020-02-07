const assert = require('assert');

const {
  afterEach,
  startAsUser,
  updateStatus,
  buildUrl,
  loginAsUser,
  TEST_USERS,
} = require('../../helpers');

const {
  generateProgram,
  createProgram,
  registerSamples,
  submitClinicalData,
} = require('../../utils/programUtils');
const { multiSelectClick, selectClick, multiCheckboxClick } = require('../../utils/formUtils');

const program = generateProgram();

module.exports = {
  tags: ['programs', 'clinical-submission'],
  desiredCapabilities: {
    name: 'Registration',
  },
  before: function(browser, done) {
    return createProgram({ jwt: TEST_USERS.DCC_ADMIN.token, program }).then(() => {
      done();
    });
  },
  'Register - Empty State': browser => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN).url(
      buildUrl(`/submission/program/${program.shortName}/sample-registration`),
    );
    browser.pause(2500);
    browser.assert.visible('#button-register-file-select');
    browser.expect.element('#button-register-samples-commit').to.have.attribute('disabled');
  },
  'Register - Upload Samples and Clear': browser => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(function(done) {
        registerSamples({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          count: 5,
        });
        done();
      })
      .pause(2500)
      .url(buildUrl(`/submission/program/${program.shortName}/sample-registration`));
    browser.pause(2500);
    browser.assert.visible('#button-register-clear-file');
    browser.expect.element('#button-register-samples-commit').to.not.have.attribute('disabled');

    browser.click('#button-register-clear-file').pause(2500);
    browser.expect.element('#button-register-samples-commit').to.have.attribute('disabled');
  },
  'Register - Upload and Commit': browser => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(function(done) {
        registerSamples({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          count: 5,
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
    browser.expect
      .element('.toastStackContainer')
      .text.to.contain('new samples have been registered');
    browser.assert.urlEquals(buildUrl(`submission/program/${program.shortName}/dashboard`));
  },
  'Submission - Empty State': browser => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN).url(
      buildUrl(`/submission/program/${program.shortName}/clinical-submission`),
    );
    browser.pause(2500);
    browser.assert.visible('#button-submission-file-select');
    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.have.attribute('disabled');
  },
  'Submission - Upload Good Clinical Data and Clear Submission': browser => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(function(done) {
        submitClinicalData({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          good: true,
        });
        done();
      })
      .pause(2500)
      .url(buildUrl(`/submission/program/${program.shortName}/clinical-submission`));
    browser.pause(2500);
    browser.expect.element('#button-validate-submission').to.not.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser.click('#button-clear-submission').pause(2500);

    browser.expect.element('.toastStackContainer').text.to.contain('Submission cleared');
    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.have.attribute('disabled');
  },

  'Submission - Upload Good Clinical Data, Validate, and Clear Submission': browser => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(function(done) {
        submitClinicalData({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          good: true,
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

    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.not.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.not.have.attribute('disabled');

    browser.click('#button-clear-submission').pause(2500);

    browser.expect.element('.toastStackContainer').text.to.contain('Submission cleared');
    browser.expect.element('#button-validate-submission').to.have.attribute('disabled');
    browser.expect.element('#button-submission-sign-off').to.have.attribute('disabled');
    browser.expect.element('#button-clear-submission').to.have.attribute('disabled');
  },

  'Submission - Upload Bad Clinical Data, Validate Error, Clear Selected File, Validate': browser => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(function(done) {
        submitClinicalData({
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
  },
};
