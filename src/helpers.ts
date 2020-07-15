import { NightwatchBrowser, Cookie } from 'nightwatch';
import { Done, TestStatus, TestCaseResults, User } from './types';

import fetch from 'isomorphic-fetch';
import urlJoin from 'url-join';

require('dotenv').config();

const BS_USER: string = process.env.BROWSERSTACK_USER || '';
const BS_KEY: string = process.env.BROWSERSTACK_ACCESS_KEY || '';
const BS_API_ROOT: string = process.env.BROWSERSTACK_API_ROOT || '';
const UI_ROOT: string = process.env.UI_ROOT || '';

// updates browerstack status
const updateStatus = (browser: NightwatchBrowser, status: TestStatus, reason: string): void => {
  const sessionId = browser.sessionId;

  const headers = new Headers();
  const authString = Buffer.from(`${BS_USER}:${BS_KEY}`).toString('base64');
  headers.set('Authorization', 'Basic ' + authString);
  headers.set('Content-Type', 'application/json');

  const params: { status: TestStatus; reason: string } = {
    status: status,
    reason: reason,
  };

  fetch(`${BS_API_ROOT}/sessions/${sessionId}.json`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(params),
  })
    .then(resp => resp.json())
    .then(console.log)
    .catch(err => console.log('err', err));
};

const submitResults = (browser: NightwatchBrowser, done: Done) => {
  const result: TestCaseResults = browser.currentTest.results;
  if (result.failed > 0) {
    const lastError = result.lastError;
    const err: string = lastError ? lastError.message : 'no message';
    updateStatus(browser, TestStatus.FAILED, err);
  }
  done();
};

/*
 * Provided a URI path, nightwatch will navigate the browser to the correct URL based on the UI_ROOT env property
 */
const visitPath = (browser: NightwatchBrowser) => (path: string): NightwatchBrowser =>
  browser.url(buildUrl(path));

export const buildUrl = (path: string): string => urlJoin(UI_ROOT, path);

/*
 * Insert JWT into cookies from env file.
 * Simulates a logged in state without requiring the login flow.
 */
const startAsUser = (browser: NightwatchBrowser) => (user: User) => {
  const cookie: Cookie = {
    name: 'EGO_JWT',
    value: user.token,
    path: '/',
    domain: UI_ROOT.replace(/http[s]?:\/\//, ''), //cookie domain has no http(s)://
    secure: false,
  };

  // Need to navigate to site before setting cookie, so we go to root.
  visitPath(browser)('/')
    .waitForElementVisible('body')
    .setCookie(cookie);
  // Now we can nav to startPath
  return visitPath(browser)(user.startPath).waitForElementVisible('body', 20000);
};

/*
 * Execute google login flow from the home page.
 * WARNING! This does not work on browserstack!
 */
const loginAsUser = (browser: NightwatchBrowser) => (user: User): NightwatchBrowser =>
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

const TEST_USERS: { [key: string]: User } = {
  DCC_ADMIN: {
    email: process.env.LOGIN_USERID_DCCADMIN || '',
    pass: process.env.LOGIN_USERPASS_DCCADMIN || '',
    token: process.env.TOKEN_DCCADMIN || '',
    startPath: '/submission/program',
  },
  PROGRAM_ADMIN_SINGLE: {
    email: process.env.LOGIN_USERID_PROGRAM_ADMIN_SINGLE || '',
    pass: process.env.LOGIN_USERPASS_PROGRAM_ADMIN_SINGLE || '',
    token: process.env.TOKEN_PROGRAM_ADMIN_SINGLE || '',
    startPath: '/submission/program/PACA-AU/dashboard',
  },
  PROGRAM_ADMIN_MULTI: {
    email: process.env.LOGIN_USERID_PROGRAM_ADMIN_MULTI || '',
    pass: process.env.LOGIN_USERPASS_PROGRAM_ADMIN_MULTI || '',
    token: process.env.TOKEN_PROGRAM_ADMIN_MULTI || '',
    startPath: '/submission/program',
  },
};

export { submitResults, startAsUser, loginAsUser, TEST_USERS };
