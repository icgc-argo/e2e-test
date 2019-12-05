const assert = require('assert');

const {
  afterEach,
  startAsUser,
  updateStatus,
  buildUrl,
  loginAsUser,
  TEST_USERS,
} = require('../../helpers');

const { generateProgram, createProgram, registerSamples } = require('../../utils/programUtils');
const { multiSelectClick, selectClick, multiCheckboxClick } = require('../../utils/formUtils');

const program = generateProgram();

module.exports = {
  tags: ['programs', 'clinical-submission'],
  desiredCapabilities: {
    name: 'Registration',
  },
  before: async browser => {
    await createProgram({ jwt: TEST_USERS.DCC_ADMIN.token, program });
  },
  'Register - Empty State': browser => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN).url(
      buildUrl(`/submission/program/${program.shortName}/sample-registration`),
    );
    browser.assert.visible('#button-register-file-select');
    browser.expect.element('#button-register-samples-commit').to.have.attribute('disabled');
  },
  'Register - Upload Samples and Clear': browser => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async () => {
        await registerSamples({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          count: 5,
        });
      })
      .pause(2500)
      .url(buildUrl(`/submission/program/${program.shortName}/sample-registration`));
    browser.assert.visible('#button-register-clear-file');
    browser.expect.element('#button-register-samples-commit').to.not.have.attribute('disabled');

    browser.click('#button-register-clear-file').pause(2000);
    browser.expect.element('#button-register-samples-commit').to.have.attribute('disabled');

    // check that the files are gone

    //   .click('#button-register-file-select')
    //   .pause(1000);
  },
  'Register - Upload and Commit': browser => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN)
      .perform(async () => {
        await registerSamples({
          jwt: TEST_USERS.DCC_ADMIN.token,
          shortName: program.shortName,
          count: 5,
        });
      })
      .pause(2500)
      .url(buildUrl(`/submission/program/${program.shortName}/sample-registration`));
    browser
      .click('#button-register-samples-commit')
      .waitForElementVisible('#modal-confirm-register')
      .click('#modal-confirm-register')
      .pause(4000);
    browser.expect
      .element('.toastStackContainer')
      .text.to.contain('new samples have been registered');
    browser.assert.urlEquals(buildUrl(`submission/program/${program.shortName}/dashboard`));
  },
};
