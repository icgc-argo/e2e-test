import { NightwatchBrowser } from 'nightwatch';

const multiSelectClick = (browser: NightwatchBrowser) => (
  selector: string,
  items: Array<string>,
) => {
  items.forEach(item => {
    browser.setValue(selector, item).click(`li[data-value="${item}"]`);
  });
};

module.exports = {
  multiSelectClick,
};
