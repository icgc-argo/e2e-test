# E2E Testing

```
e2e
|__ conf (test configuration)
| |__ dev.js (local dev conf)
| |__ browserstack.js (Browserstack conf)
|__ env (Browserstack capability files)
    |__browerstack.js (bs local testing capabilities with operating systems)
    |__dev.js (test capabilities for local dev, without operating systems)
|__ scripts (GraphQl API)
    |__ interactive.js (terminal prompt for running tests)
    |__ local.runner.js (Browerstack local network script)
|__ test_reports (test reports)
|__ tests (parents folder of tests to run)
|__ helpers.js (Browserstack API helper)
|__ readme.md
```

## Local Setup

### Chrome Driver

Get the Chrome Driver in one of the following 3 ways:

> Don't need all 3, just choose 1!

1. Download the wrapped node lib: `npm install -g chromedriver`
1. Mac Brew Package: `brew install chromedriver`
1. (:star: Most reliable!) Download directly from Chrome and setup on your system path.
   Download: https://sites.google.com/a/chromium.org/chromedriver/downloads
   Make sure chromedriver matches your binary installed version of chrome:
   https://sites.google.com/a/chromium.org/chromedriver/downloads/version-selection

   Move binary to path and make executable

```
sudo mv chromedriver /usr/bin/chromedriver
sudo chmod +x /usr/bin/chromedriver
```

### Env File

Copy the `.env.schema` file to a new file called `.env` in the project root directory. Fill out all required values.

## Browserstack

Configuration for browerstack is in `.env` file

```
BROWSERSTACK_ACCESS_KEY = ''
BROWSERSTACK_USER = ''
BROWSERSTACK_API_ROOT = https://api.browserstack.com/automate
BROWSERSTACK_SELENIUM_HOST = hub-cloud.browserstack.com
BROWSERSTACK_PROJECT_NAME = a_project_name # https://www.browserstack.com/question/640 (valid characters)
```

To execute the tests on browser stack run the command `npm run browserstack`

## Dev

You can configure tests for a local run by:

1. Copy the `conf/dev.js.schema` file into `conf/dev.js`

- By default, the `src_folders` field points to `['./tests']` which runs all tests.

1. Set the environment you want to run local tests against (either on localhost or pointing to another server). This is controlled via the .env property `UI_ROOT=http://localhost:8080`.
1. Tests are run locally using nightwatch: `npm run nightwatch`

## Creating Tests

Use [Nightwatch](http://nightwatchjs.org/api) to write tests.

All tests located in `tests` folder

Tests can be logically grouped into folders, and should be tagged appropriately so that a limited set can be run during development.

A file with commonly used functions in nightwatch tests is provided in `/helpers.js`. Of note, a method called loginAs can be used to execute the login steps for one of the TEST_USERS (also provided by helpers.js) at the start of a test case. Example:

```
const { loginAs, TEST_USERS } = require('../../helpers');

  // ... test module setup ...

  'Some Test Requiring DCC Admin': browser => {
    loginAs(browser)(TEST_USERS.DCC_ADMIN)
      // Whatever actions and assertions
      .assert.title('Expected title')
      .end();
  },
```

## Recording Tests

At the time of writing Selenium IDE doesn't have export for scripts

This recorder allows basic recording: https://github.com/vvscode/js--nightwatch-recorder

## Guidelines

- Tests should follow through a complete use case. An inability to complete a use case could be identified at one of many assertions thorughout the execution steps.
- Use CSS selectors, preferably IDs.
  - fast
  - prefer over xpath or difficult selectors for clean and concise tests
  - use IDs over variable selectors eg. nth-child(2) makes for a brittle test
  - May require adding IDs to your UI Code. By writting tests in conjunction with the UI this can be accomplished with little friction to development process

## Production run

This test package has been containerized with Docker and published on Dockerhub here: https://cloud.docker.com/u/icgcargo/repository/docker/icgcargo/e2e-test
The following command should work for a CI run:

```bash
docker run --network="host" \
  -e "BROWSERSTACK_ACCESS_KEY=<browserstack_access_key>" \
  -e "BROWSERSTACK_USER=<browserstack_user>" \
  -e "UI_ROOT=<ui_url>"  \
  icgcargo/e2e-test:<version>
```

## TODO:

[ ] - local dev, throw errors if drivers aren't installed
