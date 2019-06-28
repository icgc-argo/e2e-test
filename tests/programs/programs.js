const urlJoin = require('url-join');
const { orderBy } = require('lodash');
const { runGqlQuery, visitPath, updateStatus } = require('../../helpers');

module.exports = {
  desiredCapabilities: {
    name: 'Programs list page',
  },

  'Programs list page exists': browser => {
    visitPath(browser)('/programs')
      .waitForElementVisible('body')
      .end();
  },

  'Programs list page renders the right programs sorted by name to table': browser => {
    const programsPage = visitPath(browser)('/programs');
    runGqlQuery({
      query: `
        {
          programs {
            shortName
            name
            cancerTypes
          }
        }
      `,
    }).then(({ data: { programs } }) => {
      // programsPage.waitForElementVisible('#programs-list-container');
      programsPage.expect.elements(`.rt-td:nth-child(1)`).count.to.equal(programs.length);
      orderBy(programs, 'shortName').forEach((program, i) => {
        programsPage.assert.containsText(
          `.rt-tr-group:nth-child(${i + 1}) .rt-td:nth-child(1)`,
          program.name,
        );
        programsPage.assert.containsText(
          `.rt-tr-group:nth-child(${i + 1}) .rt-td:nth-child(2)`,
          program.shortName,
        );
        program.cancerTypes.forEach(cancerType => {
          programsPage.assert.containsText(
            `.rt-tr-group:nth-child(${i + 1}) .rt-td:nth-child(3)`,
            cancerType,
          );
        });
      });
    });
  },

  afterEach: (browser, done) => {
    const result = browser.currentTest.results;
    // manual failure check for browserstack API call
    if (result.failed > 0) {
      const err = result.lastError.message;
      updateStatus(browser, 'failed', err);
    }
    done();
  },
};
