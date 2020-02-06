const assert = require('assert');

const {
  afterEach,
  startAsUser,
  updateStatus,
  buildUrl,
  loginAsUser,
  TEST_USERS,
} = require('../helpers');

const {
  generateProgram,
  createProgram,
  registerSamples,
  submitClinicalData,
} = require('../utils/programUtils');
const { multiSelectClick, selectClick, multiCheckboxClick } = require('../utils/formUtils');

module.exports = {
  //tags: ['programs', 'clinical-submission'],
  // desiredCapabilities: {
  //   name: 'User Profile',
  // },
  'Profile - Generate/Regenerate Access Token': browser => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN).url(buildUrl(`/user`));
    browser.assert.visible('#button-generate-access-token');
    browser.expect.element('#button-generate-access-token').to.not.have.attribute('disabled');
    browser.assert.visible('#button-clipboard-copy-field');

    browser.click('#button-generate-access-token').pause(2000);

    browser.expect.element('#accessKeyExpiry').text.to.contain('Expires in: 30 days');
    browser.expect
      .element('#accessKey')
      .text.to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/); //UUID
  },
};
