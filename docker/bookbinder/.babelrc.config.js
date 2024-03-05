// @ts-check

/*
  File is called `.babelrc.config.js` instead of `.babelrc.js` so that Storybook
  doesn't try to use it (we want Storybook to use the `.babelrc.json` instead).
  This also means that the Babel CLI won't use this file automatically,
  so we have to specify it with the `--config-file` option (in `package.json` scripts).
*/

/** @type {import('@babel/core').ConfigFunction} */
module.exports = (api) => {
  // Calls `api.cache` internally; see https://babeljs.io/docs/en/config-files#apienv
  const isProduction = api.env('production');

  /** @type {import('@babel/core').PluginItem[]} */
  const presets = ['@babel/preset-typescript'];

  if (isProduction) {
    presets.push([
      'minify',
      {
        // sidestep possibility of this bug: https://github.com/babel/minify/issues/904
        builtIns: false,
      },
    ]);
  }

  const plugins = [
    'preval',
    'transform-remove-export',
    'iife-wrap',
    '@babel/plugin-proposal-class-properties',
    [
      './babel-custom-plugins/babel-prepend-comments.js',
      {
        lines: [`Don't mess with this file -- it's automatically generated.`],
      },
    ],
  ];

  return {
    presets,
    plugins,
    /*
      In production, remove all comments without `@preserve`.
      In development, leave all comments. Babel does a poor job of placing
      comments, habitually turning "leading comments" into "trailing
      comments" on the previous line. Still, I think it's best to leave them
      in during development. Could use the `preserveLines` option to help with
      the comment-placement, but it results in other things getting placed on
      "wrong" lines, making the output-file even worse to look at.
    */
    shouldPrintComment: (val) => (isProduction ? /@preserve/.test(val) : true),
  };
};
