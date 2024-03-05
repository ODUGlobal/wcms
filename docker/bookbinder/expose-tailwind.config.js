/* 
  This script runs whenever the `tailwind.config.js` has been updated,
  and exposes a FULL Tailwind config (defaults + customizations)
  at `full-tailwind-config.json`. This allows our custom
  `postcss-tailwindcss-container-query` PostCSS plugin to always have
  access to an up-to-date Tailwind config without having to invalidate
  the `require` cache for the `tailwind.config.js` module.

  Component-level scripts can also access the up-to-date config using the
  `babel-preval` plugin we've installed, like so:

  const SCREENS = preval`
    const fs = require('fs');
    const config = JSON.parse(fs.readFileSync('/app/full-tailwind-config.json'));
    module.exports = config.theme.screens;
  `;

  (NOTE: only `module.exports` the little slice of the config that you need!)
*/

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const resolveConfig = require('tailwindcss/resolveConfig');

const tailwindConfig = require(path.join(__dirname, 'tailwind.config.js'));

const fullConfig = resolveConfig(tailwindConfig);
fs.writeFileSync(
  path.join(__dirname, 'full-tailwind-config.json'),
  JSON.stringify(fullConfig)
);

// Clearing babel-loader cache is part of what's needed to force the JS files
// to recompile and hot-reload (if needed). Other part is in `.storybook/main.ts`,
// where we explicitly declare `full-tailwind.config.json` a dependency
// for the component-level JS modules.
exec('rm -rf ./node_modules/.cache/babel-loader/*');
