#!/usr/bin/env node

const delay = 0;
const misMatchThreshold = 0.1;

const fs = require('fs');
require('dotenv').config({ path: '../../.env' });
require('url');
const { execSync } = require('child_process');

/**
 * Modify the hostname for a URL.
 */
 const getTestUrl = (url, hostname) => {
  let u = new URL(url);
  u.hostname = hostname;
  return u.toString();
}

// Pull down the sitemap.
execSync('echo "{}" > ./sitemap.json && node_modules/.bin/flatten_sitemap --sitemap https://$MULTIDEV_BASE/sitemap.xml --config ./sitemap.json')

if (!fs.existsSync('./backstop-skeleton.json')) {
  throw new Error('backstop-skeleton.json not found.');
}
let config = JSON.parse(fs.readFileSync('./backstop-skeleton.json'));
const sitemap = JSON.parse(fs.readFileSync('./sitemap.json'));
const urls = sitemap.urls;

// Add scenaria.
// Take top 10 pages?
const pages = urls.slice(0, 10);
const scenarios = pages.map((url) => {
  return {
    "label": url,
    "url": getTestUrl(url, process.env.MULTIDEV_BASE),
    "referenceUrl": getTestUrl(url, process.env.LIVE_BASE),
    "readyEvent": "",
    "readySelector": "",
    "delay": delay,
    "hideSelectors": [],
    "removeSelectors": [],
    "hoverSelector": "",
    "clickSelector": "",
    "postInteractionWait": 0,
    "selectors": [],
    "selectorExpansion": true,
    "expect": 0,
    "misMatchThreshold" : misMatchThreshold,
    "requireSameDimensions": true
  };
});

config.scenarios = scenarios;
data = JSON.stringify(config, null, 2);
fs.writeFileSync('backstop.json', data);