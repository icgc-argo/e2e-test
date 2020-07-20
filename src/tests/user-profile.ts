import { BaseTest } from '../types';

import { startAsUser, buildUrl, TEST_USERS, submitResults } from '../helpers';
import { NightwatchBrowser } from 'nightwatch';

const UserProfileTest: BaseTest = {
  '@disabled': true,
  developer: 'Ciaran Schutte',
  'Profile - Generate/Regenerate API Token': (browser: NightwatchBrowser) => {
    startAsUser(browser)(TEST_USERS.DCC_ADMIN).url(buildUrl(`/user`));
    browser.assert.visible('#button-generate-api-token');
    browser.expect.element('#button-generate-api-token').to.not.have.attribute('disabled');
    browser.assert.visible('#button-clipboard-copy-field');

    browser.click('#button-generate-api-token').pause(2000);

    browser.expect.element('#apiTokenExpiry').text.to.contain('Expires in: 30 days');
    browser.expect
      .element('#apiToken')
      .text.to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/); //UUID
  },
  after: (browser, done) => submitResults(browser, done),
};

export = UserProfileTest;
