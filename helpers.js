/**
 *
 * Browserstack API helpers
 *
 */

require('dotenv').config();
const fetch = require('isomorphic-fetch');
const urlJoin = require('url-join');

const BS_USER = process.env.BROWSERSTACK_USER;
const BS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;
const BS_API_ROOT = process.env.BROWSERSTACK_API_ROOT;

const TEST_USERS = {
  DCC_ADMIN: {
    email: process.env.LOGIN_USERID_DCCADMIN,
    pass: process.env.LOGIN_USERPASS_DCCADMIN,
  },
  PRGOGRAM_ADMIN_SINGLE: {
    email: process.env.LOGIN_USERID_PROGRAM_ADMIN_SINGLE,
    pass: process.env.LOGIN_USERPASS_PROGRAM_ADMIN_SINGLE,
  },
  PRGOGRAM_ADMIN_MULTI: {
    email: process.env.LOGIN_USERID_PROGRAM_ADMIN_MULTI,
    pass: process.env.LOGIN_USERPASS_PROGRAM_ADMIN_MULTI,
  },
};

const updateStatus = (browser, status, reason) => {
  const sessionId = browser.sessionId;

  const headers = new Headers();
  const authString = Buffer.from(`${BS_USER}:${BS_KEY}`).toString('base64');
  headers.set('Authorization', 'Basic ' + authString);
  headers.set('Content-Type', 'application/json');

  const params = {
    status: status, // Completed, Error or Timeout.
    reason: reason,
  };

  fetch(`${BS_API_ROOT}/sessions/${sessionId}.json`, {
    method: 'PUT',
    headers: headers,
    auth: `${BS_USER}:${BS_KEY}`,
    body: JSON.stringify(params),
  })
    .then(resp => resp.json())
    .then(console.log)
    .catch(err => console.log('err', err));
};

const runGqlQuery = ({ query, variables }) =>
  fetch(urlJoin(process.env.GATEWAY_API_ROOT, 'graphql'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then(res => res.json());

const visitPath = browser => path => browser.url(buildUrl(path));

const buildUrl = path => urlJoin(process.env.UI_ROOT, path);

const loginAs = browser => user =>
  visitPath(browser)('/')
    .waitForElementVisible('#google-login')
    .click('#google-login')
    .waitForElementVisible('input[type="email"]')
    .setValue('input[type="email"]', user.email)
    .click('#identifierNext')
    .waitForElementVisible('input[type="password"]')
    .setValue('input[type="password"]', user.pass)
    .click('#passwordNext')
    .waitForElementVisible('nav', 20000);

module.exports = {
  runGqlQuery,
  updateStatus,
  visitPath,
  buildUrl,
  loginAs,
  TEST_USERS,
};
