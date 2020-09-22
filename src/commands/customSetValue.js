/**
 * Idiomatic style: https://nightwatchjs.org/guide/extending-nightwatch/custom-commands.html
 * Nightwatch setValue function gives varied results, sometimes failing to input
 * This manual input workaround works better: https://github.com/nightwatchjs/nightwatch/issues/983#issuecomment-239087213
 */
//@ts-nocheck
const DEFAULT_TIMEOUT = 10000;
/**
 * All kinds of wonderful quirks with automating value inputs
 * This functions attempts to help.
 * Waits for el to be visible, clicks it to make sure we have focus etc
 * (there are plenty of issues of all values not being sent if we don't click first)
 * @param {*} selector
 * @param {*} value
 */
exports.command = function(selector, value) {
  this.waitForElementVisible(selector, DEFAULT_TIMEOUT)
    .click(selector)
    .setValue(selector, value);

  return this;
};
