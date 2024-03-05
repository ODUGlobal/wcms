import { Parameters } from '@storybook/html';

import '/app/storybook-src/images-path';
import '/app/storybook-src/inject-frontback';
import '/app/storybook-src/css-importer';
import '/app/storybook-src/script-runner';

// these paths should be correct in the Docker container, so let's suppress the red lines
// @ts-ignore
export { default as render } from '/app/storybook-src/global-render-function';
// @ts-ignore
export { default as loaders } from '/app/storybook-src/global-loaders';
// @ts-ignore
export { default as args } from '/app/storybook-src/global-args';

/*
  Storybook doesn't like if we use the the `export { default as ... }`
  syntax for the global `parameters`, so just declare them here and
  (if applicable) restart Docker if changes need to be made.
*/
export const parameters: Parameters = {
  // for now, opt out of Chromatic snapshots (to conserve them)
  chromatic: {
    disableSnapshot: true,
  },

  layout: 'fullscreen',

  backgrounds: {
    disable: true,
  },

  options: {
    storySort: {
      method: 'alphabetical',
      includeName: true,
      order: [
        'Color Scheme (Theme) Demo',
        'Atom',
        'Molecule',
        'Organism',
        'Wrapper',
        'Page Template',
        'Page Demo',
      ],
    },
  },
};
