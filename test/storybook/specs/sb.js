const base_url = "https://" + process.env.MULTIDEV_BASE;

module.exports = Object.assign({}, {
  'Storybook has a root div': (browser) => {
    browser.url(base_url + "/sb/");
    browser.assert.elementPresent('div[id="root"]');
  }
});