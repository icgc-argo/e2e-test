/**
 * Idiomatic style: https://nightwatchjs.org/guide/extending-nightwatch/custom-commands.html
 * Nightwatch setValue function gives varied results, sometimes failing to input
 * This manual input workaround works better: https://github.com/nightwatchjs/nightwatch/issues/983#issuecomment-239087213
 */
//@ts-nocheck
exports.command = function(selector, value, using) {
  var self = this;

  //https://stackoverflow.com/questions/59171682/how-elements-works-in-nightwatch
  self.elements(using || 'css selector', selector, function(elems) {
    elems.value.forEach(function(element) {
      for (var c of value.split('')) {
        self.elementIdValue(Object.values(element)[0], c);
      }
    });
  });
  return this;
};
