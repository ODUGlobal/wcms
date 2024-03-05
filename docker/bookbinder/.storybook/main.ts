import type { StorybookConfig } from '@storybook/html-webpack5';

import path from 'path';
import { DefinePlugin, ProvidePlugin } from 'webpack';

import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const config: StorybookConfig = {
  framework: '@storybook/html-webpack5',

  // apparently order matters here, so put `.mdx` last (to sort Docs last in sidebar)
  stories: [
    path.resolve(__dirname, '..', 'components/**/*.stories.@(js|jsx|ts|tsx)'),
    path.resolve(__dirname, '..', 'components/**/*.mdx'),
  ],

  staticDirs: [path.resolve(__dirname, '..', 'static')],

  addons: [
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: {
          implementation: require('postcss'),
        },
      },
    },
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false, // not using this
      },
    },
    '@storybook/addon-a11y',
  ],

  typescript: {
    check: true,
  },

  webpackFinal: async (config) => {
    config.experiments = {
      ...(config.experiments ? config.experiments : {}),
      topLevelAwait: true,
    };

    config.plugins = config.plugins || [];

    // for `script-runner`
    config.plugins.push(new DefinePlugin({ COMPONENTS: '"/components"' }));

    // polyfill `Buffer` to make twing-loader compatible with webpack5; see https://viglucci.io/how-to-polyfill-buffer-with-webpack-5
    config.plugins.push(new ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }));
    config.resolve = {
      ...(config.resolve ? config.resolve : {}),
      fallback: {
        ...(config.resolve?.fallback ? config.resolve.fallback : {}),
        buffer: require.resolve('buffer/'),
      },
    };

    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin(),
    ];

    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /\.twig/,
      use: [
        {
          loader: 'twing-loader',
          options: {
            environmentModulePath: path.resolve(
              __dirname,
              'sb-main-helpers',
              'twing-environment.js'
            ),
          },
        },
        {
          loader: path.resolve(
            __dirname,
            'sb-main-helpers',
            'inject-relative-path-html-comments-loader.js'
          ),
        },
      ],
      include: path.resolve(__dirname, '..', 'components'),
    });

    // Lets us use `preval` in component JS/TS files to grab Tailwind config JSON
    // (see `package.json` and `expose-tailwind.config.js`)
    config.module.rules.push({
      test: /(?<!stories)\.(?:j|t)s$/,
      include: path.resolve(__dirname, '..', 'components'),
      exclude: path.resolve(__dirname, '..', 'components/_ts-helpers'),
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript'],
            plugins: ['preval'],
            cacheDirectory: true,
          },
        },
        {
          loader: path.resolve(
            __dirname,
            'sb-main-helpers',
            'add-dependency-loader.js'
          ),
          options: {
            file: path.join(__dirname, '..', 'full-tailwind-config.json'),
          },
        },
      ],
    });

    // for the CSS/JS asset-exporter (should just be JS now that we're outputting only a single tailwind.css)
    config.module.rules.push({
      test: /\.(?:js|css)\.txt$/,
      include: path.resolve(__dirname, '..', 'dist/asset-txt/components'),
      type: 'asset/source',
    });

    return config;
  },
};

module.exports = config;
