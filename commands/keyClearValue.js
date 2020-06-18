/**
 * A better `clearValue` for inputs having a more complex interaction.
 *
 * @export
 * @param {string} selector
 * @returns
 */
// https://github.com/nightwatchjs/nightwatch/issues/1592
exports.command = function keyClearValue(selector) {
  const { RIGHT_ARROW, BACK_SPACE } = this.Keys;
  this.getValue(selector, result => {
    const chars = result.value.split('');
    // Make sure we are at the end of the input
    chars.forEach(() => this.setValue(selector, RIGHT_ARROW));
    // Delete all the existing characters
    chars.forEach(() => this.setValue(selector, BACK_SPACE));
  });
  return this;
};
