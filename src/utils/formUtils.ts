import { NightwatchBrowser } from 'nightwatch';

const multiSelectClick = (browser: NightwatchBrowser) => (
  selector: string,
  items: Array<string>,
) => {
  items.forEach(item => {
    browser.setValue(selector, item).click(`li[data-value="${item}"]`);
  });
};

const selectClick = (browser: NightwatchBrowser) => (selector: string, item: string) => {
  browser.click(selector).click(`${selector}-options li[data-value="${item}"]`);
};

const multiCheckboxClick = (browser: NightwatchBrowser) => (
  selector: string,
  items: Array<string>,
) => {
  items.forEach(item => {
    browser.click(`${selector} div[data-value="${item}"]`);
  });
};

export { multiSelectClick, selectClick, multiCheckboxClick };
