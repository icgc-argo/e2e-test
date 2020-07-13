const multiSelectClick = browser => (selector, items) => {
  items.forEach(item => {
    browser.setValue(selector, item).click(`li[data-value="${item}"]`);
  });
};

const selectClick = browser => (selector, item) => {
  browser.click(selector).click(`${selector}-options li[data-value="${item}"]`);
};

const multiCheckboxClick = browser => (selector, items) => {
  items.forEach(item => {
    browser.click(`${selector} div[data-value="${item}"]`);
  });
};

module.exports = {
  multiSelectClick,
  selectClick,
  multiCheckboxClick,
};
