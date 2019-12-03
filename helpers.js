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
    token: process.env.TOKEN_DCCADMIN,
    startPath: '/submission/program',
  },
  PROGRAM_ADMIN_SINGLE: {
    email: process.env.LOGIN_USERID_PROGRAM_ADMIN_SINGLE,
    pass: process.env.LOGIN_USERPASS_PROGRAM_ADMIN_SINGLE,
    token: process.env.TOKEN_PROGRAM_ADMIN_SINGLE,
    startPath: '/submission/program/PACA-AU/dashboard',
  },
  PROGRAM_ADMIN_MULTI: {
    email: process.env.LOGIN_USERID_PROGRAM_ADMIN_MULTI,
    pass: process.env.LOGIN_USERPASS_PROGRAM_ADMIN_MULTI,
    token: process.env.TOKEN_PROGRAM_ADMIN_MULTI,
    startPath: '/submission/program',
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

// TODO: Requires Authorization header, provide option to specify which user is making the request (or default to DCCAdmin)
const runGqlQuery = async ({ query, variables, jwt }) => {
  return new Promise((resolve, reject) => {
    fetch(urlJoin(process.env.GATEWAY_API_ROOT, 'graphql'), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }).then(res => resolve(res.json()));
  });
};

/*
 * Provided a URI path, nightwatch will navigate the browser to the correct URL based on the UI_ROOT env property
 */
const visitPath = browser => path => browser.url(buildUrl(path));

const buildUrl = path => urlJoin(process.env.UI_ROOT, path);

/*
 * Execute google login flow from the home page.
 * WARNING! This does not work on browserstack!
 */
const loginAsUser = browser => user =>
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

/*
 * Insert JWT into cookies from env file.
 * Simulates a logged in state without requiring the login flow.
 */
const startAsUser = browser => user => {
  const cookie = {
    name: 'EGO_JWT',
    value: user.token,
    path: '/',
    domain: process.env.UI_ROOT.replace(/http[s]?:\/\//, ''), //cookie domain has no http(s)://
  };

  // Need to navigate to site before setting cookie, so we go to root.
  visitPath(browser)('/')
    .waitForElementVisible('body')
    .setCookie(cookie);
  // Now we can nav to startPath
  return visitPath(browser)(user.startPath).waitForElementVisible('body', 20000);
};

/*
 * Convenience function for getting the content of every element that matches a CSS selector
 * Returns that content as an array
 */
const elementValues = browser => selector => {
  const output = [];
  browser.elements('css selector', selector, elems =>
    elems.value.forEach(elem => {
      browser.elementIdText(elem.ELEMENT, elemContent => {
        output.push(elemContent.value);
      });
    }),
  );
  return output;
};

/*
 * Convenience function for executing logic on the response from elementValues.
 * Callback takes one argument which is the array of element content. Example:
 * callback = items=>{assert(isTrue(),'was it true')}
 */
const performWithValues = browser => (selector, callback) => {
  let values = [];
  browser
    .perform(() => {
      values = elementValues(browser)(selector);
    })
    .perform(() => {
      callback(values);
    });
};

const afterEach = (browser, done) => {
  const result = browser.currentTest.results;
  // manual failure check for browserstack API call
  if (result.failed > 0) {
    const err = result.lastError.message;
    updateStatus(browser, 'failed', err);
  }
  done();
};

module.exports = {
  afterEach,
  runGqlQuery,
  updateStatus,
  visitPath,
  buildUrl,
  loginAsUser,
  startAsUser,
  elementValues,
  performWithValues,
  TEST_USERS,
};
