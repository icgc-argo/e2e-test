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

A) Download the wrapped node lib: `npm install -g chromedriver`
B) (Mac Brew Package) `brew install chromedriver`
C) (Most reliable!) Download directly from Chrome and setup on your system path.
Download: https://sites.google.com/a/chromium.org/chromedriver/downloads
Make sure chromedriver matches your binary installed version of chrome:
https://sites.google.com/a/chromium.org/chromedriver/downloads/version-selection

Move binary to path and make executable

```
sudo mv chromedriver /usr/bin/chromedriver
sudo chmod +x /usr/bin/chromedriver
```

## Browserstack

Configuration for browerstack is in `.env` file

```
BROWSERSTACK_ACCESS_KEY = ''
BROWSERSTACK_USER = ''
BROWSERSTACK_API_ROOT = https://api.browserstack.com/automate
BROWSERSTACK_SELENIUM_HOST = hub-cloud.browserstack.com
BROWSERSTACK_PROJECT_NAME = a_project_name # https://www.browserstack.com/question/640 (valid characters)
```

## Dev

- Copy the `conf/dev.js.schema` file into `conf/dev.js`
- By default, the `src_folders` field points to `['./tests']` which runs all tests. Point this to sub folders where your test files are.
- Running the test locally `npm run dev`

## Creating Tests

Use Nightwatch (http://nightwatchjs.org) to write tests.
All tests located in `tests` folder
Tests can be logically grouped into folders

## Recording Tests

At the time of writing Selenium IDE doesn't have export for scripts

This recorder allows basic recording: https://github.com/vvscode/js--nightwatch-recorder

## Guidelines

- Tests should test for one passing condition (keep it atomic)
- Use CSS selectors, preferably IDs.
  - fast
  - prefer over xpath or difficult selectors for clean and concise tests
  - use IDs over variable selectors eg. nth-child(2) makes for a brittle test

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
