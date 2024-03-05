// @ts-check

const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const chroma = require('chroma-js');

const {
  default: _escapeClassName,
} = require('tailwindcss/lib/util/escapeClassName');
/**
 * @param {string} s
 * @returns {string}
 */
const escapeClassName = (s) => _escapeClassName(s);

// @ts-ignore
const { normalize: _normalize } = require('tailwindcss/lib/util/dataTypes');

/**
 * @param {string} value
 * @param {boolean} isRoot
 * @returns {string}
 */
const normalize = (value, isRoot = true) => _normalize(value, isRoot);

// SOME HELPER FUNCTIONS
/** @param {number} num */
const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '');

// /** @param {number} px */
// const rem = (px) => `${round(px / 16)}rem`;

/** @param {number} px */
const em = (px, base = 16) => `${round(px / base)}em`;

// SITE-WIDE SPACING CONSTANTS
const containerPadding = defaultTheme.spacing[6];
const verticalSpaceMobile = defaultTheme.spacing[10];
const verticalSpace = defaultTheme.spacing[16];

/**
 * Used in both `theme.screens` and our custom `.container` component.
 * This way, we can add other min-width responsive-variants to `theme.screens`
 * if needed without including them in our `.container` component.
 */
const containerBreakpoints = {
  /* Tailwind defaults, but in `em` (see https://danburzo.ro/media-query-units/) */
  sm: em(640),
  md: em(768),
  lg: em(1024),
  xl: em(1280),
  // I prefer to stop at `xl`
  // '2xl': em(1536)
};

/*
  `colors` AND `typography` ARE SET UP OUTSIDE OF `module.exports`.
  EVERYTHING ELSE IS DECLARED INSIDE `module.exports`.
*/

/* COLORS AND COLOR-THEMING */

/*
  List just the explicit colors here (not the ones defined in terms of CSS variables).
  The CSS-variable ones get added after they're declared below.

  Acceptable syntaxes: named CSS colors, HEX, RGB, and HSL (no alpha channels!!!).
  Note: Tailwind will convert all of these to RGB, except for HSL.
  If you use HSL, be sure to use `%` on the S and L values.
*/

/**
 * Number-system from Figma: https://www.figma.com/file/jwSDNLRQP5H24mV90KlsJP/ODUGlobal-%7C-Design-System?node-id=905-6760&t=4Qo3iKFW9j8IsYNW-0
 */
const projectColors = /** @type const */ ({
  neutral: {
    50: '#f4f5f6',
    100: '#dee0e2',
    200: '#ced1d4',
    300: '#b7bdc0',
    400: '#a9b0b4',
    500: '#949ca1',
    600: '#878e93',
    700: '#696f72',
    800: '#515659',
    900: '#3e4244',
  },
  navy: {
    50: '#e6ebf0',
    100: '#b0c1d0',
    200: '#8aa3b9',
    300: '#547999',
    400: '#335f85',
    500: '#003767',
    600: '#00325e',
    700: '#002749',
    800: '#001e39',
    900: '#00172b',
  },
  'mid-blue': {
    50: '#e6eef3',
    100: '#b0cad9',
    200: '#8ab1c7',
    300: '#548dae',
    400: '#33779e',
    500: '#005586',
    600: '#004d7a',
    700: '#003c5f',
    800: '#002f4a',
    900: '#002438',
  },
  'light-blue': {
    50: '#fbfcfe',
    100: '#f1f5fa',
    200: '#ebf0f8',
    300: '#e2eaf5',
    400: '#dce5f3',
    500: '#d3dff0',
    600: '#c0cbda',
    700: '#969eaa',
    800: '#747b84',
    900: '#595e65',
  },
  yellow: {
    50: '#fffae6',
    100: '#fff0b0',
    200: '#ffe98a',
    300: '#ffdf55',
    400: '#ffd934',
    500: '#ffcf01',
    600: '#e8bc01',
    700: '#b59301',
    800: '#8c7201',
    900: '#6b5700',
  },
  gold: {
    50: '#faf5ea',
    100: '#eedfbe',
    200: '#e6d09e',
    300: '#daba72',
    400: '#d3ad56',
    500: '#c8982c',
    600: '#b68a28',
    700: '#8e6c1f',
    800: '#6e5418',
    900: '#544012',
  },
  'dark-teal': {
    50: '#e6f3f5',
    100: '#b0d9e0',
    200: '#8ac6d1',
    300: '#54acbc',
    400: '#339caf',
    500: '#00839b',
    600: '#00778d',
    700: '#005d6e',
    800: '#004855',
    900: '#003741',
  },
  'light-teal': {
    50: '#eff9f8',
    100: '#ceedea',
    200: '#b6e4df',
    300: '#94d8d1',
    400: '#80d1c8',
    500: '#60c5ba',
    600: '#57b3a9',
    700: '#448c84',
    800: '#356c66',
    900: '#28534e',
  },
});

/** Incorporates and expands on `projectColors` */
const colors = /** @type {const} */ ({
  transparent: 'transparent',
  inherit: 'inherit',
  current: 'currentColor',
  white: {
    DEFAULT: 'white',
  },
  black: {
    DEFAULT: '#181a1b',
    true: 'black',
  },
  ...projectColors,
});

/*
  COLOR-THEMING OVERVIEW

  In the templates, use the `data-tw-theme` attribute to set a theme,
  like `data-tw-theme="purple"`.

  Then you can use "abstract" utility-classes like `bg-theme-bg-color`
  (or whichever ones you define below) that are defined in terms of CSS variables
  and will resolve to the correct value for the most recent `data-tw-theme`
  declaration.

  You can also use TW variants like `theme-purple:bg-purple theme-green:bg-green`
  to be more explicit in the templates, if you prefer (see the THEMING VARIANTS
  down in the plugins area of this file). And you can use both approaches together.

  Advantages of the variable approach:

  - super easy to add new variants (just define its values for the CSS variables;
    no need to go through your templates looking for where you need to add
    utility-classes);
  - more succinct (`bg-theme-bg-color` vs `theme-purple:bg-purple theme-green:bg-green ...`).

  Advantages of the variant approach:

  - more explicit styling in the templates, in keeping with the TW way;
  - don't have to worry about coming up with abstract variable names, which
    becomes more of a problem as the number of variables increases
    (think "primary", "secondary", "tertiary" colors for each theme, etc);
  - don't need to force a single theming "schema" to fit with all themes for all
    components (in practice, different themes and components often end up
    with different needs, and with the variable-approach the solution is to keep
    adding more variables, which compounds the aforementioned problem of
    having to come up with abstract variable names).

  I lean toward a mixed approach, where variables are used for a handful of key
  properties that all themes should have a value for, and then variants are used
  for "one-off" situations and for overriding the variables where needed.
*/

/*
  COLOR-THEMING STEP 1:

  Declare all theme-names in this `themeNames` array. It will be used both for
  CSS-variable declarations and for generating the TW theming variants.

  I think a good practice is to declare a theme for each color that's
  supposed to be available as a background-color for slab/organism-style
  components.

  Note: the first one listed will be treated as the default theme, which means
  that its values for the CSS variables will be duplicated on `:root`,
  and also that its TW theming variant will be usable even where no theme
  has been declared. For a typical site, the default theme should correspond
  to a white background-color.

  For now, I don't have an automated way of giving Storybook access to this list
  (which would be useful for the Storybook Controls). Instead, you'll want to
  manually maintain the enum in `./components/_ts-helpers/theme.ts`
*/
const themeNames = /** @type {const} */ ([
  'default', // can rename, but first one is always treated as default
  'neutral-50',
  'mid-blue-500',
  'navy-500',
  'light-blue-500',
  'gold-300',
  'neutral-900',
  'light-teal-300',
  'yellow-500',
  'navy-700',
  'light-blue-300',
  'light-blue-100',
]);

/*
  COLOR-THEMING STEP 2:

  Store all the color-theming CSS variable info in `themeColors` below. The TW colors and
  corresponding CSS variables you list will automatically be created from this data.

  A few notes:

  1) There really should be parity between the theme-names declared in the `themeNames` array
  above and the keys in every `themeVals` object below. If there isn't, then you could
  run into a situation where a nested theme-declaration wrongly inherits CSS-variable values
  from the outer-theme's scope. To help prevent you from making this mistake, the JSDoc syntax
  is set up to give you red underlines until there's parity.

  2) For the color-values in `themeVals`, you can use HEX, RGB, HSL, or named CSS colors.
  Don't include any alpha information, though (it will just be ignored). The CSS variables
  will be defined as raw RGB channels (like `0 0 0`), regardless of which color-syntax you use.
  This is to allow Tailwind's opacity-modifiers to work with them, as described
  in the docs: https://tailwindcss.com/docs/customizing-colors#using-css-variables

  3) I recommend using the `colors` object to store ALL colors under explicit names,
  and then referencing color-values in that object in your `themeVals` values below.
*/

/**
 * @typedef {Object} ThemeColor
 * @property {string} twColor Name of color to add to Tailwind
 * @property {`--${string}`} [cssVar] Name of CSS variable (optional; defaults to ``` `--${twColor}` ```)
 * @property {{ [C in themeNames[number]]: string }} themeVals The actual CSS color-values to use for each theme
 */

/** @type {ThemeColor[]} */
const themeColors = [
  {
    twColor: 'theme-bg-color',
    themeVals: {
      default: colors.white.DEFAULT,
      'neutral-50': colors.neutral[50],
      'mid-blue-500': colors['mid-blue'][500],
      'navy-500': colors.navy[500],
      'light-blue-500': colors['light-blue'][500],
      'gold-300': colors.gold[300],
      'neutral-900': colors.neutral[900],
      'light-teal-300': colors['light-teal'][300],
      'yellow-500': colors.yellow[500],
      'navy-700': colors.navy[700],
      'light-blue-300': colors['light-blue'][300],
      'light-blue-100': colors['light-blue'][100],
    },
  },
  {
    twColor: 'theme-text-color',
    themeVals: {
      default: colors.black.DEFAULT,
      'neutral-50': colors.black.DEFAULT,
      'mid-blue-500': colors.white.DEFAULT,
      'navy-500': colors.white.DEFAULT,
      'light-blue-500': colors.black.DEFAULT,
      'gold-300': colors.black.DEFAULT,
      'neutral-900': colors.white.DEFAULT,
      'light-teal-300': colors.black.DEFAULT,
      'yellow-500': colors.black.DEFAULT,
      'navy-700': colors.white.DEFAULT,
      'light-blue-300': colors.black.DEFAULT,
      'light-blue-100': colors.black.DEFAULT,
    },
  },
  {
    twColor: 'theme-heading-color',
    themeVals: {
      default: colors.black.DEFAULT,
      'neutral-50': colors.black.DEFAULT,
      'mid-blue-500': colors.white.DEFAULT,
      'navy-500': colors.white.DEFAULT,
      'light-blue-500': colors.black.DEFAULT,
      'gold-300': colors.black.DEFAULT,
      'neutral-900': colors.white.DEFAULT,
      'light-teal-300': colors.black.DEFAULT,
      'yellow-500': colors.black.DEFAULT,
      'navy-700': colors.white.DEFAULT,
      'light-blue-300': colors.black.DEFAULT,
      'light-blue-100': colors.black.DEFAULT,
    },
  },
  {
    twColor: 'theme-subsup-color',
    themeVals: {
      default: colors.neutral[900],
      'neutral-50': colors.neutral[900],
      'mid-blue-500': colors.neutral[100],
      'navy-500': colors.neutral[100],
      'light-blue-500': colors.neutral[900],
      'gold-300': colors.neutral[900],
      'neutral-900': colors.neutral[100],
      'light-teal-300': colors.neutral[900],
      'yellow-500': colors.neutral[900],
      'navy-700': colors.neutral[100],
      'light-blue-300': colors.neutral[900],
      'light-blue-100': colors.neutral[900],
    },
  },
  {
    twColor: 'theme-fancy-link-color',
    themeVals: {
      default: colors.navy[500],
      'neutral-50': colors.navy[500],
      'mid-blue-500': colors.yellow[500],
      'navy-500': colors.yellow[500],
      'light-blue-500': colors.navy[500],
      'gold-300': colors.navy[500],
      'neutral-900': colors.yellow[500],
      'light-teal-300': colors.navy[600],
      'yellow-500': colors.navy[500],
      'navy-700': colors.yellow[500],
      'light-blue-300': colors.navy[500],
      'light-blue-100': colors.navy[500],
    },
  },
  {
    twColor: 'theme-fancy-link-hocus-color',
    themeVals: {
      default: colors.navy[400],
      'neutral-50': colors.navy[400],
      'mid-blue-500': colors.yellow[400],
      'navy-500': colors.yellow[400],
      'light-blue-500': colors.navy[400],
      'gold-300': colors.navy[400],
      'neutral-900': colors.yellow[400],
      'light-teal-300': colors.navy[500],
      'yellow-500': colors.navy[400],
      'navy-700': colors.yellow[400],
      'light-blue-300': colors.navy[400],
      'light-blue-100': colors.navy[400],
    },
  },
  {
    twColor: 'theme-button-bg-color',
    themeVals: {
      default: colors.navy[500],
      'neutral-50': colors.navy[500],
      'mid-blue-500': colors.yellow[500],
      'navy-500': colors.yellow[500],
      'light-blue-500': colors.navy[500],
      'gold-300': colors.navy[500],
      'neutral-900': colors.yellow[500],
      'light-teal-300': colors.navy[600],
      'yellow-500': colors.navy[500],
      'navy-700': colors.yellow[500],
      'light-blue-300': colors.navy[500],
      'light-blue-100': colors.navy[500],
    },
  },
  {
    twColor: 'theme-button-text-color',
    themeVals: {
      default: colors.white.DEFAULT,
      'neutral-50': colors.white.DEFAULT,
      'mid-blue-500': colors.navy[500],
      'navy-500': colors.navy[500],
      'light-blue-500': colors.white.DEFAULT,
      'gold-300': colors.white.DEFAULT,
      'neutral-900': colors.navy[500],
      'light-teal-300': colors.white.DEFAULT,
      'yellow-500': colors.white.DEFAULT,
      'navy-700': colors.navy[500],
      'light-blue-300': colors.white.DEFAULT,
      'light-blue-100': colors.white.DEFAULT,
    },
  },
  {
    twColor: 'theme-button-hocus-bg-color',
    themeVals: {
      default: colors.navy[400],
      'neutral-50': colors.navy[400],
      'mid-blue-500': colors.yellow[400],
      'navy-500': colors.yellow[400],
      'light-blue-500': colors.navy[400],
      'gold-300': colors.navy[400],
      'neutral-900': colors.yellow[400],
      'light-teal-300': colors.navy[500],
      'yellow-500': colors.navy[400],
      'navy-700': colors.yellow[400],
      'light-blue-300': colors.navy[400],
      'light-blue-100': colors.navy[400],
    },
  },
];

// add CSS-variable colors to `colors` object
themeColors.forEach(({ twColor, cssVar }) => {
  colors[twColor] = `rgb(var(${cssVar || `--${twColor}`}) / <alpha-value>)`;
});

/*
  TYPOGRAPHY

  Here, add to and/or modify these Typography styles:
  https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js

  Modifications can admittedly be a bit annoying to make. The main thing to understand
  is that a rule like `figure: { marginTop: 1em; }` here will override Typography's base
  figure top-margin (which you can find in the link above), but:

  A) that's ALL it will do (it will still preserve other `figure` rules);
  B) it will only override that rule in the particular namespace you use. For example, if
     you do it in `DEFAULT.css`, then your override will work only in `.prose` but not in
     `.prose-lg`, say. To do something similar in `.prose-lg`, make a corresponding rule
     in `lg.css`.

  If you want to clear out an entire base Typography selector, you can hunt down the
  selector in the link above and do something like `figure: null` (again, might have to do
  it in multiple namespaces).

  For more about customization, see the docs:
  https://tailwindcss.com/docs/typography-plugin#customizing-the-css

  BUT: note that some of what we're doing with Typography in this repo means that not
  everything in the docs is applicable. For example, we're using "legacy" mode, which
  disables the `:where()` stuff entirely (b/c we still need to support Safari versions
  that can't handle it); instead, we have a custom PostCSS plugin that turns all the
  Typography rules into some rather complex `:not()` rules that essentially turn them off
  within `.wysiwyg-embed` injections (so, similar behavior to the `:where()` / `.no-prose`
  stuff, but without the lowered specificity). Also, `.prose-invert` isn't giving
  satisfactory results, so we're overriding almost all of the default colors in `DEFAULT.css`
  to use theme-colors and to make it easy to make color-variants.

  Thanks to our aforementioned custom `postcss-tailwindcss-typography-embeds.config.js` plugin,
  we shouldn't have to make any modifications *just* for the sake of embedding components
  into WYSIWYG sections (no need for `figure: null` to prevent `.prose figure` styles
  from overriding in-template utility classes on a `figure` in an embedded component),
  so that should help keep the number of necessary modifications to a minimum.
  And we get the benefit of excellent out-of-the-box prose styles with built-in
  responsive variants.

  Note: for class-selectors, use `[class~="someClass"]` instead of `.someClass`
  (otherwise Tailwind will treat `.someClass` as a utility-class and it won't work
  right when we use responsive prose variants like `lg:prose-lg`).

  Also: be careful not to use the same key twice in one of these CSS-in-JS objects
  (i.e, the `css` namespaces). If you need to repeat a key, you can use an ARRAY of
  CSS-in-JS objects instead of a single object, as described in the docs (at bottom):
  https://tailwindcss.com/docs/plugins#css-in-js-syntax
*/
const typography = {
  DEFAULT: {
    css: {
      /*
        The plugin will use this variable for the `color` ON the `.prose` wrapper.
        We just make it correspond to the active theme's text-color. Elsewhere,
        we also explicitly set the text-color of `.wysiwyg-embed`, so that it
        doesn't inherit this `.prose` color. Usually that won't really be important,
        since we just set that one to the theme text-color too, but it WILL be important
        if we make one-off `prose-` color-variants that don't use the theme's text-color.
      */
      '--tw-prose-body': 'rgb(var(--theme-text-color))',

      /*
        Now set all the other relevant TW Typography color-variables to theme-colors too.
        Prefer recycling the `--tw-prose-body` variable here (instead of referring again
        to `--theme-text-color` directly), so that it's easier to make `prose-` color variants
        (by just changing the value of that one `--tw-prose-body` variable and any remaining
        variables as needed).
      */
      '--tw-prose-headings': 'rgb(var(--theme-heading-color))',
      '--tw-prose-lead': 'var(--tw-prose-body)',
      // this we'll set elsewhere below b/c we need to set link hocus-colors anyway:
      // '--tw-prose-links': 'rgb(var(--theme-fancy-link-color))',
      '--tw-prose-bold': 'var(--tw-prose-body)',
      '--tw-prose-counters': 'var(--tw-prose-body)',
      '--tw-prose-bullets': 'var(--tw-prose-body)',
      '--tw-prose-hr': 'var(--tw-prose-body)',
      '--tw-prose-quotes': 'var(--tw-prose-body)',
      '--tw-prose-quote-borders': 'var(--tw-prose-body)',
      '--tw-prose-captions': 'var(--tw-prose-body)',
      '--tw-prose-code': 'var(--tw-prose-body)',
      // pre almost certainly won't get used on site, so don't worry about these unless we have to:
      // '--tw-prose-pre-code': '',
      // '--tw-prose-pre-bg': '',
      // these we'll set elsewhere below b/c we'll need to customize all table styles anyway:
      // '--tw-prose-th-borders': '',
      // '--tw-prose-td-borders': '',

      'a:not([class~="fancy"]):not([class~="button"]):not(table[class~="striped"] thead th a)':
        {
          /* tw */ '@apply text-theme-fancy-link-color hocus:text-theme-fancy-link-hocus-color decoration-1':
            '',
        },

      /* more or less copy-pasted from `FancyLink.twig` */
      'a[class~="fancy"]': {
        /* tw */ '@apply [--pr:1.5em] pr-[--pr] [--w:calc(14em/16)] [--shift:calc(4em/16)] [--after-buffer:calc(6em/16)] [--duration:150ms]':
          '',
        /* tw */ '@apply relative inline-block no-underline font-bold font-sans text-theme-fancy-link-color hocus:text-theme-fancy-link-hocus-color duration-[--duration]':
          '',
        /* tw */ '@apply after:top-[calc(1em/16)] firefox:after:top-[calc(2em/16)]':
          '',
        /* tw */ '@apply after:inline-block after:mask-arrow-fancy after:bg-current after:pointer-events-none':
          '',
        /* tw */ '@apply after:relative after:ml-[calc(-1*var(--w))] after:w-[--w] after:h-[--w] after:left-[calc(var(--w)+var(--after-buffer))]':
          '',
        /* tw */ '@apply hocus:after:translate-x-[--shift] motion-reduce:after:translate-x-[--shift] after:transition-[transform,background-color] after:ease-linear after:duration-[--duration] after:will-change-transform':
          '',
      },

      /* more or less copy-pasted from `Button.twig` */
      'a.button': {
        /* tw */ '@apply inline-block no-underline text-center transition-colors text-lg leading-tight font-sans font-bold tracking-wider':
          '',
        /* tw */ '@apply py-3.5 px-6 border-3 border-transparent text-theme-button-text-color bg-theme-button-bg-color hocus:bg-theme-button-hocus-bg-color':
          '',
        /* tw */ '@apply [&.ghost]:bg-transparent [&.ghost]:border-theme-button-bg-color [&.ghost]:text-theme-button-bg-color':
          '',
        /* tw */ '@apply [&.ghost]:hocus:bg-theme-button-bg-color [&.ghost]:hocus:text-theme-button-text-color':
          '',
        /* tw */ '@apply [&.yellow]:bg-yellow-500 [&.yellow]:border-transparent [&.yellow]:text-theme-button-bg-color':
          '',
        /* tw */ '@apply [&.yellow]:hocus:bg-yellow-300': '',
      },

      // style these like h4
      'h5, h6': {
        marginBottom: em(8, 16),
        lineHeight: round(24 / 16),
        color: 'var(--tw-prose-headings)',
        fontWeight: '600',
      },
      'h5 strong, h6 strong': {
        fontWeight: '700',
        color: 'inherit',
      },
      'h5:not(hr + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + *), h6:not(hr + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + *)':
        {
          marginTop: em(24, 16),
        },
      'h5 + *, h6 + *': {
        marginTop: '0',
      },

      'ul ul': { /* tw */ '@apply list-[circle]': '' },

      'ul ul ul': { /* tw */ '@apply list-disc': '' },

      'ol ol': { /* tw */ '@apply list-[lower-alpha]': '' },

      'ol ol ol': { /* tw */ '@apply list-[lower-roman]': '' },

      /*
        These elements break (in various ways) when against a left-float, so just clear them.
        Not ideal, but by far the simplest solution. The only other thing I found that works
        is to use `display: flow-root`, but then you have to introduce some complex rules to
        try to cancel vertical-margins on first/last children, and you have to do it in a nested
        way (b/c `margin-trim` has no browser-support yet).
      */
      'blockquote, ul, ol': { /* tw */ '@apply clear-left': '' },

      thead: {
        /* tw */ '@apply border-b-3 border-light-teal-500': '',
      },

      'tbody tr': {
        /* tw */ '@apply border-neutral-200': '',
      },

      'tbody tr:last-child': {
        /* tw */ '@apply border-b-1': '',
      },

      'thead th, tbody td': {
        /* tw */ '@apply !p-4': '',
      },

      'table[class~="smaller-table-cells"]': {
        'thead th, tbody td': {
          /* tw */ '@apply !px-1.5 !py-1': '',
        },
      },

      'table[class~="striped"]': {
        thead: {
          /* tw */ '@apply border-y border-navy-500 bg-mid-blue-500': '',
        },

        'thead th': {
          /* tw */ '@apply border-x border-navy-500 text-white': '',
        },

        'thead th a': {
          /* tw */ '@apply text-white hocus:text-white/[.85]': '',

          '[class~="tablesort--desc"], [class~="tablesort--asc"]': {
            /* tw */ '@apply bg-none mask-tablesort bg-current': '',
          },

          '[class~="tablesort--asc"]': {
            /* tw */ '@apply rotate-180': '',
          },
        },

        'tbody td': {
          /* tw */ '@apply border border-neutral-200': '',
        },

        'tbody tr:first-child td': {
          /* tw */ '@apply border-t-0': '',
        },

        'tbody tr:nth-child(even)': {
          /* tw */ '@apply bg-neutral-50': '',
        },
      },

      caption: { /* tw */ '@apply caption-bottom text-left mt-5 ml-4': '' },

      /*
        These `.align-` classes should go ON the `div.wysiwyg-embed` elements.
        Typically we'll also want to use our container-query trick on these, like:

        `<div data-container-query-ancestor class="wysiwyg-embed tw-align-left">`
      */

      // for left-float
      '[class~="tw-align-left"]': {
        /* tw */ '@apply my-8 sm:float-left sm:mt-2 sm:max-w-1/2 sm:mr-10': '',
        '&[class~="small"]': {
          /* tw */ '@apply lg:max-w-1/3': '',
        },
        '&:first-child': { /* tw */ '@apply mt-0 sm:mt-2': '' },
        '&:last-child': { /* tw */ '@apply mb-0': '' },
      },

      // for right-float
      '[class~="tw-align-right"]': {
        /* tw */ '@apply my-8 sm:float-right sm:mt-2 sm:max-w-1/2 sm:ml-10': '',
        '&[class~="small"]': {
          /* tw */ '@apply lg:max-w-1/3': '',
        },
        '&:first-child': { /* tw */ '@apply mt-0 sm:mt-2': '' },
        '&:last-child': { /* tw */ '@apply mb-0': '' },
      },

      // for centered; use `clear-both` also if necessary (i.e., for full-width things, not for things like fancy-links)
      '[class~="tw-align-center"]': {
        /* tw */ '@apply my-8 flex justify-center': '',
        '&:first-child': { /* tw */ '@apply mt-0': '' },
        '&:last-child': { /* tw */ '@apply mb-0': '' },
      },

      // for no float/centering (just applies y-margin); use `clear-both` also if necessary (i.e., for full-width things, not for things like fancy-links)
      '[class~="tw-align-none"]': {
        /* tw */ '@apply my-8': '',
        '&:first-child': { /* tw */ '@apply mt-0': '' },
        '&:last-child': { /* tw */ '@apply mb-0': '' },
      },

      /*
        Allow wrappers between `.prose` and actual content w/o affecting spacing around the WYSIWYG.
        Requires that innermost wrapper has the `.wysiwyg` class.
        (Mirrors the built-in `.prose > :first-child` / `.prose > :last-child` rules.)
      */
      '[class~="wysiwyg"] > :first-child': { /* tw */ '@apply mt-0': '' },
      '[class~="wysiwyg"] > :last-child': { /* tw */ '@apply mb-0': '' },

      // Account for wysiwyg-embed being very first item
      '[class~="wysiwyg-embed"]:first-child + *': {
        /* tw */ '@apply !mt-0': '',
      },
    },
  },

  lg: {
    css: {
      // style these like h4
      'h5, h6': {
        marginBottom: em(8, 18),
        lineHeight: round(28 / 18),
      },
      'h5:not(hr + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + *), h6:not(hr + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + *)':
        {
          marginTop: em(32, 18),
        },
      'h5 + *, h6 + *': {
        marginTop: '0',
      },
    },
  },

  xl: {
    css: {
      // style these like h4
      'h5, h6': {
        marginBottom: em(12, 20),
        lineHeight: round(32 / 20),
      },
      'h5:not(hr + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + *), h6:not(hr + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + *)':
        {
          marginTop: em(36, 20),
        },
      'h5 + *, h6 + *': {
        marginTop: '0',
      },
    },
  },

  // uses theme's `subsup` color instead of theme's main text color
  subsup: {
    css: {
      '--tw-prose-body': 'rgb(var(--theme-subsup-color))',
    },
  },
};

/* EXPORT TAILWIND CONFIG */

/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    /*
      uses `@media (hover: hover) and (pointer: fine) { &:hover }` instead of just `&:hover`
      (gives better results on touch-devices with things like buttons)
    */
    hoverOnlyWhenSupported: true,
  },

  theme: {
    extend: {
      spacing: {
        container: containerPadding, // matches x-padding of `.container`
        'container-offset': 'var(--container-offset)', // distance b/w edge of screen and container-content (including the padding)
        'molecule-padding': defaultTheme.spacing[7],
        'vertical-space': 'var(--vertical-space)', // for vertical rhythm,
        'vertical-space-value': verticalSpace,
        'vertical-space-mobile-value': verticalSpaceMobile,
      },

      // max-w-1/2, max-w-1/3, max-w-2/3, max-w-1/4, etc. (each num in array is denominator)
      maxWidth: Object.fromEntries(
        [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].flatMap((n) =>
          Array.from({ length: n - 1 }, (_, i) => [
            `${++i}/${n}`,
            `${round((100 * i) / n)}%`,
          ])
        )
      ),

      // TW only includes 1 (implicit default-value), 2, 4, and 8; supplement with odds and 6
      borderWidth: Object.fromEntries(
        [1, 3, 5, 6, 7].map((px) => [px, `${px}px`])
      ),

      /*
        TW already has `basis-` utilities for x/2, x/3, x/4, x/5, x/6, and x/12 values;
        supplement w/ 7ths, 8ths, 9ths, 10ths, 11ths, and 13ths.
        So would be like basis-5/7, basis-7/9, etc. (each num in array is denominator)
      */
      flexBasis: Object.fromEntries(
        [7, 8, 9, 10, 11, 13].flatMap((n) =>
          Array.from({ length: n - 1 }, (_, i) => [
            `${++i}/${n}`,
            `${round((100 * i) / n)}%`,
          ])
        )
      ),

      lineHeight: {
        0: '0',
      },

      transitionDuration: {
        DEFAULT: '250ms',
      },

      keyframes: {
        'fade-in': {
          from: { /* tw */ '@apply opacity-0': '' },
          to: { /* tw */ '@apply opacity-100': '' },
        },
        'fade-out': {
          from: { /* tw */ '@apply opacity-100': '' },
          to: { /* tw */ '@apply opacity-0': '' },
        },
      },

      aria: {
        /**
         * Note: this treats `aria-current` as if it were a boolean attribute.
         * Technically it *isn't* a boolean attribute, but for styling purposes
         * this suffices, as long as we never use the `aria-current:` variant
         * with an element that has `aria-current="false"`. (In other words,
         * we should always omit the attribute instead of setting it to `"false"`).
         */
        current: 'current',
      },

      typography,
    }, // end `extend`

    /* OVERRIDES */

    // use `em` for media-queries (see https://danburzo.ro/media-query-units/)
    screens: {
      xs: em(360),
      ...containerBreakpoints,
      'sidebar-up': containerBreakpoints.lg, // will never get the container-query treatment
      short: { raw: `(max-height: ${em(400)})` },
      '16-9': { raw: '(min-aspect-ratio: 16/9)' },
      firefox: { raw: 'screen and (min--moz-device-pixel-ratio:0)' }, // only use as a last resort
    },

    fontFamily: {
      // in 400 (`font-normal`), 400i (`font-normal italic`), and 700 (`font-bold`)
      sans: ['Archivo', ...defaultTheme.fontFamily.sans],
      // in 400 (`font-normal`) and 800 (`font-extrabold`)
      display: ['"Archivo SemiExpanded"', ...defaultTheme.fontFamily.sans],
      // in 600 (`font-semibold`) and 700 (`font-bold`)
      super: ['"Archivo SemiCondensed"', ...defaultTheme.fontFamily.sans],
    },

    colors,
  },

  corePlugins: {
    // we'll make a custom `.container` component instead (see below)
    container: false,

    // disable aspectRatio in favor of aspect-ratio plugin (see below) b/c Safari support is too recent: https://caniuse.com/mdn-css_properties_aspect-ratio
    aspectRatio: false,

    // disable backdrop-filters, since Firefox support is too recent: https://caniuse.com/?search=backdrop
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,

    /*
      There may well be others that we shouldn't use yet -- check https://caniuse.com regularly.

      Don't use gap- utilities with flexbox for now (at least in important spots), b/c Safari support is too new: https://caniuse.com/flexbox-gap
      (but we can't disable gap- utilities b/c we need them for grid and multi-column layouts)
    */
  },

  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography')({
      target: 'legacy', // don't use the :where() selectors for now b/c of Safari support
    }),

    /*
      For plugin functions that use CSS-in-JS syntax, be careful not to accidentally use
      the same key twice in a single object! If you need to use the same selector twice, just
      break up the plugin into multiple plugins (we're already using multiple `addBase()` calls
      partly for this reason), or use an array of objects instead of a single object as
      described in the docs (at bottom): https://tailwindcss.com/docs/plugins#css-in-js-syntax
    */
    plugin(
      ({
        addBase,
        addComponents,
        addUtilities,
        matchUtilities,
        addVariant,
        matchVariant,
        theme,
      }) => {
        addBase({
          /*
            Set color, font, fontSize, and lineHeight for `body` (and also `.wysiwyg-embed`).
            Do the same for Storybook Docs demos
          */
          'body, [class~="wysiwyg-embed"], [class~="sb-anchor"][class~="sb-anchor"]':
            {
              /* tw */ '@apply font-sans text-base text-theme-text-color': '',
            },

          body: {
            /*
              Since we're setting the body text-color (above), we also want to set
              the body bg-color, in case the user's browser is setting a default
              bg-color that would result in insufficient color-contrast.
            */
            /* tw */ '@apply bg-theme-bg-color': '',
          },

          /*
            By default, make too-long-words wrap mid-word if needed (instead of creating overflow).
            We make an exception for tables (and we can make more case-by-case exceptions as needed).
            Note that we have a `word-break: break-word` fallback. That's a deprecated value, but
            we need the fallback b/c Safari support for `overflow-wrap: anywhere` is so recent.
            See: https://developer.mozilla.org/en-US/docs/Web/CSS/word-break#sect2
          */
          '@supports (overflow-wrap: anywhere)': {
            body: {
              overflowWrap: 'anywhere',
            },
            table: {
              overflowWrap: 'normal',
            },
          },
          '@supports not (overflow-wrap: anywhere)': {
            body: {
              wordBreak: 'break-word',
            },
            table: {
              wordBreak: 'normal',
            },
          },

          // offset underlines a bit
          '*, ::before, ::after': {
            /* tw */ '@apply underline-offset-[max(2px,.05em)]': '',
          },

          a: {
            /* tw */ '@apply transition-colors': '',
          },

          /*
            Suppress focus-outline when focus was triggered by a click or tap.
            For Safari, this depends on `focus-visible` polyfill and `postcss-focus-visible` plugin.
          */
          ':focus:not(:focus-visible)': {
            outline: 'none',
          },

          '[hidden]': {
            /* tw */ '@apply !hidden': '',
          },

          br: {
            /* tw */ '@apply !m-0': '',
          },
        });

        // create color-theming CSS variables
        const themingVariableEntries = themeNames.flatMap((themeName, i) => {
          const valueEntries = themeColors.flatMap(
            ({ cssVar, themeVals, twColor }) => {
              const color = themeVals?.[themeName];
              if (!color) return [];
              if (!chroma.valid(color)) {
                console.warn(
                  `Warning: skipping \`${color}\` because it is in an invalid format.`
                );
                return [];
              }
              const [r, g, b] = chroma(color).rgb(false);
              return [[cssVar || `--${twColor}`, `${r} ${g} ${b}`]];
            }
          );

          if (!valueEntries.length) return [];

          const isDefault = !i;

          const key = `${
            isDefault ? ':root, ' : ''
          }[data-tw-theme="${themeName}"]`;

          /** @type {Record<string, string>} */
          const value = Object.fromEntries(valueEntries);

          return [[key, value]];
        });

        if (themingVariableEntries.length) {
          addBase(Object.fromEntries(themingVariableEntries));
        }

        // vertical-rhythm CSS variables
        addBase({
          ':root': {
            '--vertical-space': verticalSpaceMobile,
            '@screen sm': {
              '--vertical-space': verticalSpace,
            },
          },
        });

        // container-related CSS variables
        addBase({
          ':root': {
            '--container-padding': containerPadding,

            // note: `--real-vw` must be set via JS (it's b/c 100vw includes scrollbar and creates overflow)
            '--100vw': 'calc(var(--real-vw, 1vw) * 100)',

            '--container-max-width': 'var(--100vw)',
            ...Object.fromEntries(
              Object.entries(containerBreakpoints).map(([name, breakpoint]) => {
                const key = `@screen ${name}`;
                const value = {
                  '--container-max-width': breakpoint.replace(
                    /(?<!r)em$/,
                    'rem'
                  ),
                };
                return [key, value];
              })
            ),

            // so we can always use `var(--container-width)` to get current container width
            '--container-width':
              'calc(min(var(--100vw), var(--container-max-width)) - 2 * var(--container-padding))',

            /*
              distance b/w edge of screen and container-content (including the padding);
              use like `-mx-container-offset` to "break out" of a container to go full-bleed
            */
            '--container-offset':
              'calc((var(--100vw) - var(--container-width)) / 2)',
          },
        });

        // container and related components (nothing to do with container-QUERY stuff, by the way)
        addComponents({
          '.container': {
            /* tw */ '@apply w-full mx-auto px-container max-w-none': '',

            ...Object.fromEntries(
              Object.values(containerBreakpoints).map((breakpointValue) => [
                `@media (min-width: ${breakpointValue})`,
                { maxWidth: breakpointValue.replace(/(?<!r)em$/, 'rem') },
              ])
            ),
          },

          // Use like `container lg:no-container` to "undo" container at breakpoint.
          '.no-container': {
            /* tw */ '@apply mx-0 px-0 max-w-none': '',
          },

          /*
            Use this instead of `.container` for non-full-bleed pieces, so that
            the `.container` won't apply when it shouldn't. Covers the following
            situations, where max-width/x-spacing is already handled on an ancestor
            (we want to avoid the extra padding that `.container` would supply):
              - the piece is within a `.wysiwyg-embed`
              - the piece is in the sidebar or the main area against a sidebar, and the screen is
                wide enough that the main area and sidebar are side-by-side
              - the piece is in a `.constrained-content` region
              - the piece is in a `.container-canceler` region (for one-offs)
          */
          '.conditional-container': {
            /* tw */ '@apply container wysiwyg-embed:no-container with-sidebar-up:no-container constrained-content:no-container [.container-canceler_&]:no-container':
              '',
          },
        });

        // vertical-rhythm helpers
        addComponents({
          /*
            Gives `.my-vertical-space`, but "cancels" the top- (bottom-) margin when the element
            in question is inside (or is itself) the first (last) slab in the main-area-against-sidebar,
            but only when the `sidebar-up` breakpoint has been reached. Also "cancels" corresponding
            margin when it's a direct first/last child of a `.wysiwyg-embed`. Finally, also "cancels"
            if piece is in a `.vertical-rhythm-canceler` region (for one-offs).
          */
          '.vertical-rhythm-standard': {
            /* tw */ '@apply my-vertical-space with-sidebar-up-first:mt-0 with-sidebar-up-last:mb-0 wysiwyg-embed-first:mt-0 wysiwyg-embed-last:mb-0 [.vertical-rhythm-canceler_&]:my-0':
              '',
          },
          '.vertical-rhythm-standard-bottom': {
            /* tw */ '@apply mb-vertical-space with-sidebar-up-last:mb-0 wysiwyg-embed-last:mb-0 [.vertical-rhythm-canceler_&]:mb-0':
              '',
          },
          '.vertical-rhythm-standard-top': {
            /* tw */ '@apply mt-vertical-space with-sidebar-up-first:mt-0 wysiwyg-embed-first:mt-0 [.vertical-rhythm-canceler_&]:mt-0':
              '',
          },
        });

        // for typical 16/9 video embeds
        addComponents({
          '.responsive-embed': {
            /* tw */ '@apply relative overflow-hidden pt-[56.25%]': '',

            iframe: {
              /* tw */ '@apply absolute top-0 left-0 w-full h-full border-0':
                '',
            },
          },
        });

        // to set a font-size without also setting the accompanying line-height (e.g., `text-size-sm` vs. `text-sm`)
        matchUtilities(
          {
            'text-size': (value) => ({ fontSize: value }),
          },
          {
            values: (() => {
              /**
               * Can't figure out how to use Tailwind's built-in `fontSizes` type effectively, so doing this manually:
               * @type {undefined | Record<string, string | [string, string | {}]>}
               */
              const fontSizes = theme('fontSize');
              return Object.fromEntries(
                Object.entries(fontSizes || {}).map(([key, value]) => [
                  key,
                  Array.isArray(value) ? value[0] : value,
                ])
              );
            })(),
          }
        );

        /*
          Use this w/ TW's normal `content-[]` syntax to add alt-text syntax
          (for benefit of screen-readers) in browsers that support it:

          class="before:content-['ideally_decorative_content'] before:content-alt-['']"

          TW seems to add these to the stylesheet after the `content-` rules, so
          this *should* always win the specificity battle, but if it doesn't then
          you can always make it !important like `before:!content-alt-['alt-text']`.

          Demo here: https://play.tailwindcss.com/EBlnX7PxKz

          But be careful with this: in browsers that don't support this syntax,
          screen-readers WILL ANNOUNCE non-empty `content` values, and these values
          WILL AFFECT accessible names of elements! Depending on the circumstance,
          that can be very bad for accessibility. For example, here is a neat
          trick to get a stroke-only "text-shadow" on a heading, but because
          the pseudo-element's `content` duplicates the heading-text, the accessible
          name of the heading (in browsers that don't support the alt-text syntax)
          is the heading-text REPEATED: https://codepen.io/newcitymike/pen/LYBWpoV
        */
        matchUtilities({
          'content-alt': (value) => ({
            '@supports (content: "x" / "y")': {
              content: `var(--tw-content) / ${value}`,
            },
          }),
        });

        // mask-related utilities
        addUtilities({
          '.mask-arrow-fancy': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.429411 12.6692L2.35788 14.5976L7.50048 9.45503L7.50051 9.45505L9.42898 7.52658L2.35792 0.455513L0.429444 2.38399L5.57201 7.52656L0.429411 12.6692Z" fill="#003767"/></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-plus-in-square': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 0H0V20H20V0ZM1.71429 18.2857V1.71429H18.2857V18.2857H1.71429ZM9.14295 5.42827V9.14256H5.42866V10.8568H9.14295V14.5711H10.8572V10.8568H14.5715V9.14256H10.8572V5.42827H9.14295Z" fill="#003767"/></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-double-arrow': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 14 12" xmlns="http://www.w3.org/2000/svg"><path d="M1.41 -6.16331e-08L-4.62904e-07 1.41L4.58 6L-6.16331e-08 10.59L1.41 12L7.41 6L1.41 -6.16331e-08Z" fill="#171919"/><path d="M7.99984 -6.16331e-08L6.58984 1.41L11.1698 6L6.58984 10.59L7.99984 12L13.9998 6L7.99984 -6.16331e-08Z" fill="#171919"/></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-x': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M13.69.321a1.057 1.057 0 0 0-1.498 0L7 5.503 1.808.31A1.057 1.057 0 1 0 .31 1.808L5.503 7 .31 12.192a1.057 1.057 0 1 0 1.497 1.497L7 8.497l5.192 5.192a1.057 1.057 0 1 0 1.497-1.497L8.497 7l5.192-5.192a1.064 1.064 0 0 0 0-1.487z" fill-rule="evenodd"/></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-circled-x': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z"/></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-facebook': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1772_592)"><path d="M22 12.0611C22 6.50451 17.5229 2 12 2C6.47715 2 2 6.50451 2 12.0611C2 17.0828 5.65684 21.2452 10.4375 22V14.9694H7.89844V12.0611H10.4375V9.84452C10.4375 7.32296 11.9305 5.93012 14.2146 5.93012C15.3084 5.93012 16.4531 6.12663 16.4531 6.12663V8.60261H15.1922C13.95 8.60261 13.5625 9.37822 13.5625 10.1747V12.0611H16.3359L15.8926 14.9694H13.5625V22C18.3432 21.2452 22 17.0828 22 12.0611Z"/></g><defs><clipPath id="clip0_1772_592"><rect width="24" height="24"/></clipPath></defs></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-instagram': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1772_667)"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.0059 3.80113C14.6793 3.80113 14.9959 3.81285 16.0473 3.85974C17.0244 3.90272 17.5521 4.06681 17.9038 4.20356C18.369 4.38328 18.7051 4.60207 19.053 4.9498C19.4047 5.30143 19.6197 5.63352 19.7995 6.09846C19.9363 6.45009 20.1004 6.98144 20.1434 7.95429C20.1903 9.00918 20.2021 9.32565 20.2021 11.9941C20.2021 14.6665 20.1903 14.983 20.1434 16.034C20.1004 17.0107 19.9363 17.5382 19.7995 17.8898C19.6197 18.3548 19.4008 18.6908 19.053 19.0385C18.7012 19.3901 18.369 19.605 17.9038 19.7847C17.5521 19.9215 17.0205 20.0856 16.0473 20.1285C14.992 20.1754 14.6754 20.1871 12.0059 20.1871C9.33242 20.1871 9.01583 20.1754 7.96443 20.1285C6.9873 20.0856 6.45964 19.9215 6.10788 19.7847C5.64276 19.605 5.30662 19.3862 4.95876 19.0385C4.607 18.6869 4.39203 18.3548 4.21223 17.8898C4.07543 17.5382 3.91128 17.0068 3.86828 16.034C3.82138 14.9791 3.80965 14.6626 3.80965 11.9941C3.80965 9.32174 3.82138 9.00527 3.86828 7.95429C3.91128 6.97753 4.07543 6.45009 4.21223 6.09846C4.39203 5.63352 4.6109 5.29752 4.95876 4.9498C5.31053 4.59816 5.64276 4.38328 6.10788 4.20356C6.45964 4.06681 6.99121 3.90272 7.96443 3.85974C9.01583 3.81285 9.33242 3.80113 12.0059 3.80113ZM12.0059 2C9.28943 2 8.94938 2.01172 7.88235 2.05861C6.81923 2.10549 6.08833 2.2774 5.45515 2.52354C4.79461 2.7814 4.23569 3.12131 3.68067 3.68002C3.12175 4.23481 2.78171 4.79351 2.52374 5.44989C2.27751 6.08674 2.10553 6.81344 2.05863 7.87615C2.01173 8.94667 2 9.28658 2 12.002C2 14.7173 2.01173 15.0572 2.05863 16.1239C2.10553 17.1866 2.27751 17.9172 2.52374 18.5501C2.78171 19.2104 3.12175 19.7691 3.68067 20.3239C4.23569 20.8787 4.79461 21.2225 5.45124 21.4765C6.08833 21.7226 6.81532 21.8945 7.87844 21.9414C8.94548 21.9883 9.28552 22 12.002 22C14.7184 22 15.0584 21.9883 16.1255 21.9414C17.1886 21.8945 17.9195 21.7226 18.5527 21.4765C19.2093 21.2225 19.7682 20.8787 20.3232 20.3239C20.8782 19.7691 21.2222 19.2104 21.4763 18.554C21.7225 17.9172 21.8945 17.1905 21.9414 16.1278C21.9883 15.0611 22 14.7212 22 12.0059C22 9.29049 21.9883 8.95058 21.9414 7.88396C21.8945 6.82125 21.7225 6.09064 21.4763 5.45771C21.23 4.79351 20.89 4.23481 20.3311 3.68002C19.776 3.12522 19.2171 2.7814 18.5605 2.52745C17.9234 2.2813 17.1964 2.1094 16.1333 2.06251C15.0623 2.01172 14.7223 2 12.0059 2ZM12.0059 6.86426C9.16834 6.86426 6.86621 9.16549 6.86621 12.002C6.86621 14.8385 9.16834 17.1397 12.0059 17.1397C14.8435 17.1397 17.1457 14.8385 17.1457 12.002C17.1457 9.16549 14.8435 6.86426 12.0059 6.86426ZM12.0059 15.3347C10.165 15.3347 8.67196 13.8422 8.67196 12.002C8.67196 10.1618 10.165 8.6693 12.0059 8.6693C13.8469 8.6693 15.3399 10.1618 15.3399 12.002C15.3399 13.8422 13.8469 15.3347 12.0059 15.3347ZM17.3488 7.86033C18.0094 7.86033 18.5488 7.32507 18.5488 6.66088C18.5488 6.00059 18.0094 5.46143 17.3488 5.46143C16.6883 5.46143 16.1489 5.99669 16.1489 6.66088C16.1489 7.32117 16.6844 7.86033 17.3488 7.86033Z"/></g><defs><clipPath id="clip0_1772_667"><rect width="24" height="24"/></clipPath></defs></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-twitter': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 1200 1227" xmlns="http://www.w3.org/2000/svg"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="white"/></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-youtube': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1608_13702)"><path d="M21.7908 8.18691C21.7908 8.18691 21.5857 6.73906 20.9541 6.10332C20.1543 5.2666 19.2602 5.2625 18.85 5.21328C15.9133 5 11.5041 5 11.5041 5H11.4959C11.4959 5 7.08672 5 4.15 5.21328C3.73984 5.2625 2.8457 5.2666 2.0459 6.10332C1.41426 6.73906 1.21328 8.18691 1.21328 8.18691C1.21328 8.18691 1 9.88906 1 11.5871V13.1785C1 14.8766 1.20918 16.5787 1.20918 16.5787C1.20918 16.5787 1.41426 18.0266 2.0418 18.6623C2.8416 19.499 3.8916 19.4703 4.35918 19.5605C6.04082 19.7205 11.5 19.7697 11.5 19.7697C11.5 19.7697 15.9133 19.7615 18.85 19.5523C19.2602 19.5031 20.1543 19.499 20.9541 18.6623C21.5857 18.0266 21.7908 16.5787 21.7908 16.5787C21.7908 16.5787 22 14.8807 22 13.1785V11.5871C22 9.88906 21.7908 8.18691 21.7908 8.18691ZM9.33027 15.1104V9.2082L15.0027 12.1695L9.33027 15.1104Z"/></g><defs><clipPath id="clip0_1608_13702"><rect width="24" height="24"/></clipPath></defs></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-tiktok': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1608_13701)"><path d="M15.5604 2H12.1898V15.6232C12.1898 17.2464 10.8935 18.5797 9.28022 18.5797C7.66695 18.5797 6.37057 17.2464 6.37057 15.6232C6.37057 14.029 7.63814 12.7246 9.19381 12.6667V9.24639C5.7656 9.30433 3 12.1159 3 15.6232C3 19.1594 5.82321 22 9.30904 22C12.7948 22 15.618 19.1304 15.618 15.6232V8.63767C16.8856 9.56522 18.4412 10.1159 20.0833 10.1449V6.72464C17.5482 6.63768 15.5604 4.55072 15.5604 2Z"/></g><defs><clipPath id="clip0_1608_13701"><rect width="24" height="24"/></clipPath></defs></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-linkedin': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1608_13703)"><path d="M20.5195 2H3.47656C2.66016 2 2 2.64453 2 3.44141V20.5547C2 21.3516 2.66016 22 3.47656 22H20.5195C21.3359 22 22 21.3516 22 20.5586V3.44141C22 2.64453 21.3359 2 20.5195 2ZM7.93359 19.043H4.96484V9.49609H7.93359V19.043ZM6.44922 8.19531C5.49609 8.19531 4.72656 7.42578 4.72656 6.47656C4.72656 5.52734 5.49609 4.75781 6.44922 4.75781C7.39844 4.75781 8.16797 5.52734 8.16797 6.47656C8.16797 7.42188 7.39844 8.19531 6.44922 8.19531ZM19.043 19.043H16.0781V14.4023C16.0781 13.2969 16.0586 11.8711 14.5352 11.8711C12.9922 11.8711 12.7578 13.0781 12.7578 14.3242V19.043H9.79688V9.49609H12.6406V10.8008H12.6797C13.0742 10.0508 14.043 9.25781 15.4844 9.25781C18.4883 9.25781 19.043 11.2344 19.043 13.8047V19.043Z"/></g><defs><clipPath id="clip0_1608_13703"><rect width="24" height="24"/></clipPath></defs></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-pinterest': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1458_20955)"><path d="M12 2C6.47656 2 2 6.47656 2 12C2 16.2383 4.63672 19.8555 8.35547 21.3125C8.26953 20.5195 8.1875 19.3086 8.39062 18.4453C8.57422 17.6641 9.5625 13.4766 9.5625 13.4766C9.5625 13.4766 9.26172 12.8789 9.26172 11.9922C9.26172 10.6016 10.0664 9.5625 11.0703 9.5625C11.9219 9.5625 12.3359 10.2031 12.3359 10.9727C12.3359 11.832 11.7891 13.1133 11.5078 14.3008C11.2734 15.2969 12.0078 16.1094 12.9883 16.1094C14.7656 16.1094 16.1328 14.2344 16.1328 11.5312C16.1328 9.13672 14.4141 7.46094 11.957 7.46094C9.11328 7.46094 7.44141 9.59375 7.44141 11.8008C7.44141 12.6602 7.77344 13.582 8.1875 14.082C8.26953 14.1797 8.28125 14.2695 8.25781 14.3672C8.18359 14.6836 8.01172 15.3633 7.98047 15.5C7.9375 15.6836 7.83594 15.7227 7.64453 15.6328C6.39453 15.0508 5.61328 13.2266 5.61328 11.7578C5.61328 8.60156 7.90625 5.70703 12.2188 5.70703C15.6875 5.70703 18.3828 8.17969 18.3828 11.4844C18.3828 14.9297 16.2109 17.7031 13.1953 17.7031C12.1836 17.7031 11.2305 17.1758 10.9023 16.5547C10.9023 16.5547 10.4023 18.4648 10.2812 18.9336C10.0547 19.8008 9.44531 20.8906 9.03906 21.5547C9.97656 21.8438 10.9688 22 12 22C17.5234 22 22 17.5234 22 12C22 6.47656 17.5234 2 12 2Z"/></g><defs><clipPath id="clip0_1458_20955"><rect width="24" height="24"/></clipPath></defs></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-home': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1458_26126)"><path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z"/></g><defs><clipPath id="clip0_1458_26126"><rect width="24" height="24"/></clipPath></defs></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-phone': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 11 18" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-998.000000, -1722.000000)" fill-rule="nonzero"><g transform="translate(110.000000, 1453.000000)"><g transform="translate(846.000000, 108.000000)"><g transform="translate(37.597826, 155.000000)"><g transform="translate(4.985507, 6.583333)"><path d="M7.41666667,6.11066753e-13 C8.93544973,6.11066753e-13 10.1666667,1.23121694 10.1666667,2.75 L10.1666667,2.75 L10.1666667,14.0833333 C10.1666667,15.6021164 8.93544973,16.8333333 7.41666667,16.8333333 L7.41666667,16.8333333 L2.75,16.8333333 C1.23121694,16.8333333 4.4408921e-14,15.6021164 4.4408921e-14,14.0833333 L4.4408921e-14,14.0833333 L4.4408921e-14,2.75 C4.4408921e-14,1.23121694 1.23121694,6.11066753e-13 2.75,6.11066753e-13 L2.75,6.11066753e-13 Z M7.41666667,1.5 L2.75,1.5 C2.05964406,1.5 1.5,2.05964406 1.5,2.75 L1.5,2.75 L1.5,14.0833333 C1.5,14.7736893 2.05964406,15.3333333 2.75,15.3333333 L2.75,15.3333333 L7.41666667,15.3333333 C8.1070226,15.3333333 8.66666667,14.7736893 8.66666667,14.0833333 L8.66666667,14.0833333 L8.66666667,2.75 C8.66666667,2.05964406 8.1070226,1.5 7.41666667,1.5 L7.41666667,1.5 Z M5.08333333,12.5 L5.19023603,12.5061671 C5.64612983,12.5591184 6,12.9465671 6,13.4166667 C6,13.9229277 5.58959435,14.3333333 5.08333333,14.3333333 C4.57707231,14.3333333 4.16666667,13.9229277 4.16666667,13.4166667 C4.16666667,12.9465671 4.52053684,12.5591184 4.97643064,12.5061671 L5.08333333,12.5 Z"></path></g></g></g></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-fax': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-993.000000, -1749.000000)" fill-rule="nonzero"><g transform="translate(110.000000, 1453.000000)"><g transform="translate(846.000000, 108.000000)"><g transform="translate(37.597826, 155.000000)"><g transform="translate(-0.000000, 33.597826)"><path d="M12.288087,6.32383035e-13 C12.6240418,6.32383035e-13 12.9468425,0.116417614 13.2041372,0.32736584 L13.3102431,0.423496001 L14.9895475,2.10280035 C15.2269607,2.34021357 15.3731399,2.65119413 15.4059751,2.98208405 L15.4130435,3.12495652 L15.4139223,4.87070365 C16.5699186,4.90195534 17.4968374,5.84637037 17.5,7.01121739 L17.5,7.01121739 L17.5,14.6654312 C17.4967883,15.8452424 16.541616,16.8004146 15.3586957,16.8046957 L15.3586957,16.8046957 L4.92119321,16.8046957 C4.18217767,16.8020125 3.53107051,16.4260925 3.14696029,15.8551119 C2.84802077,16.01587 2.50422258,16.1077187 2.13858451,16.1090385 C0.958895157,16.1047604 0.00321119027,15.1494067 1.15463195e-14,13.9677391 L1.15463195e-14,13.9677391 L1.15463195e-14,7.70483153 C0.00321048023,6.52439382 0.959156909,5.56877771 2.14334423,5.56556799 C2.50664522,5.56655612 2.84870153,5.65780777 3.14825581,5.81815394 C3.5320221,5.24743871 4.18361319,4.87192481 4.92391304,4.86991304 L4.869,4.871 L4.86956522,0.75 C4.86956522,0.370304234 5.1517191,0.0565090391 5.51779466,0.006846616 L5.61956522,6.32383035e-13 L12.288087,6.32383035e-13 Z M15.3566576,6.36991027 L4.92595293,6.36991027 C4.57096955,6.37087577 4.28357082,6.6581752 4.28260592,7.01121739 L4.28260592,7.01121739 L4.28260592,14.6613514 C4.28357011,15.0158504 4.57123087,15.3034117 4.92391304,15.3047006 L4.92391304,15.3047006 L15.3559783,15.3047006 C15.7117753,15.3034115 15.9990378,15.016149 16.0000028,14.6633913 L16.0000028,14.6633913 L16.0000028,7.01325543 C15.9990371,6.65787655 15.7120365,6.37087598 15.3566576,6.36991027 L15.3566576,6.36991027 Z M2.14117391,7.06517391 L2.04837066,7.07275922 C1.73847379,7.11930753 1.50087466,7.38592212 1.49999723,7.70686957 L1.49999723,7.70686957 L1.49999723,13.9656992 C1.50096141,14.3201982 1.78862217,14.6077596 2.13858451,14.6090484 C2.49398652,14.6077596 2.78164728,14.3201982 2.78261146,13.9677391 L2.78261146,13.9677391 L2.78261146,7.7089076 C2.78164657,7.35382737 2.49424784,7.06652795 2.14117391,7.06517391 L2.14117391,7.06517391 Z M13.2357648,12.0021043 C13.7883442,12.0021043 14.2357648,12.450021 14.2357648,13.0021043 C14.2357648,13.5541877 13.7883442,14.0021043 13.2357648,14.0021043 C12.6841775,14.0021043 12.2362609,13.5541877 12.2362609,13.0021043 C12.2362609,12.450021 12.6841775,12.0021043 13.2357648,12.0021043 Z M13.6889565,8.60843478 C14.2269299,8.60843478 14.6630435,9.04454837 14.6630435,9.58252174 C14.6630435,10.1204951 14.2269299,10.5566087 13.6889565,10.5566087 L13.6889565,10.5566087 L6.63713043,10.5566087 C6.09915706,10.5566087 5.66304348,10.1204951 5.66304348,9.58252174 C5.66304348,9.04454837 6.09915706,8.60843478 6.63713043,8.60843478 L6.63713043,8.60843478 Z M12.2651739,1.49917391 L6.36917391,1.49917391 L6.369,4.869 L13.913,4.869 L13.9121739,3.14717391 L12.2651739,1.49917391 Z"></path></g></g></g></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-email': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 18 14" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-994.000000, -1779.000000)" fill-rule="nonzero"><g transform="translate(110.000000, 1453.000000)"><g transform="translate(846.000000, 108.000000)"><g transform="translate(37.597826, 155.000000)"><g transform="translate(0.985507, 63.886000)"><path d="M14.0833333,-6.00408612e-13 C14.6115873,-6.00408612e-13 15.1050531,0.148945933 15.5240251,0.407132138 C15.7925549,0.345512846 16.0850848,0.435443129 16.2713741,0.66336444 C16.4232342,0.849162387 16.47118,1.08589903 16.4222883,1.30316446 C16.6825807,1.72231389 16.8333333,2.21855186 16.8333333,2.75 L16.8333333,2.75 L16.8333333,9.41666667 C16.8333333,10.9354497 15.6021164,12.1666667 14.0833333,12.1666667 L14.0833333,12.1666667 L2.75,12.1666667 C1.23121694,12.1666667 1.42108547e-14,10.9354497 1.42108547e-14,9.41666667 L1.42108547e-14,9.41666667 L1.42108547e-14,2.75 C1.42108547e-14,2.21855186 0.15075262,1.72231389 0.411827579,1.30171635 C0.362153326,1.08589903 0.410099116,0.849162387 0.561959266,0.66336444 C0.748248538,0.435443129 1.0407784,0.345512846 1.30957205,0.406637471 C1.72780259,0.149090138 2.22149036,-6.00408612e-13 2.75,-6.00408612e-13 L2.75,-6.00408612e-13 Z M1.54090914,2.43162036 C1.51421518,2.53326918 1.5,2.63997452 1.5,2.75 L1.5,2.75 L1.5,9.41666667 C1.5,10.1070226 2.05964406,10.6666667 2.75,10.6666667 L2.75,10.6666667 L14.0833333,10.6666667 C14.7736893,10.6666667 15.3333333,10.1070226 15.3333333,9.41666667 L15.3333333,9.41666667 L15.3333333,2.75 C15.3333333,2.64033408 15.3192109,2.53396663 15.2926855,2.43261708 L8.89130223,7.66404073 C8.64581931,7.86468381 8.30491613,7.88697749 8.03822871,7.73092176 L7.94203111,7.66404073 Z M14.063,1.499 L2.77,1.499 L8.41666667,6.114 L14.063,1.499 Z"></path></g></g></g></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-map-marker': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-487.000000, -646.000000)"><path d="M495,646 C490.581722,646 487,649.581722 487,654 C487,659.4 494.05,665.5 494.35,665.76 C494.724224,666.080088 495.275776,666.080088 495.65,665.76 C496,665.5 503,659.4 503,654 C503,649.581722 499.418278,646 495,646 Z M495,663.65 C492.87,661.65 489,657.34 489,654 C489,650.686292 491.686292,648 495,648 C498.313709,648 501,650.686292 501,654 C501,657.34 497.13,661.66 495,663.65 Z M495,650 C492.790861,650 491,651.790861 491,654 C491,656.209139 492.790861,658 495,658 C497.209139,658 499,656.209139 499,654 C499,652.939134 498.578573,651.921718 497.828427,651.171573 C497.078282,650.421427 496.060866,650 495,650 Z M495,656 C493.895431,656 493,655.10457 493,654 C493,652.895431 493.895431,652 495,652 C496.10457,652 497,652.895431 497,654 C497,655.10457 496.10457,656 495,656 Z"></path></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-quotemark': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 45 36" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-362.000000, -2224.000000)" fill-rule="nonzero"><g transform="translate(0.000000, 1323.000000)"><g transform="translate(359.000000, 901.000000)"><path d="M14.1356754,-1.13686838e-13 C19.460744,-1.13686838e-13 23.4545455,4.03572562 23.4545455,8.96827915 C23.4545455,13.3029474 19.7565811,17.0397304 15.4669425,17.0397304 C12.3606525,17.0397304 9.5501996,14.7976606 8.95852531,11.6587629 C8.36685101,16.1429025 11.1773039,24.363825 19.0169883,31.837391 C22.2711969,34.9762887 18.8690697,37.0688872 16.9461282,35.4247027 C7.62725815,26.9048375 4.37304954,20.9259847 3.18970096,14.1997753 C2.00635238,7.32409464 6.44390957,-1.13686838e-13 14.1356754,-1.13686838e-13 Z M38.6811299,-1.13686838e-13 C44.0061985,-1.13686838e-13 48,4.03572562 48,8.96827915 C48,13.3029474 44.3020357,17.0397304 40.0123971,17.0397304 C36.906107,17.0397304 34.0956541,14.7976606 33.5039799,11.6587629 C32.9123056,16.1429025 35.7227584,24.363825 43.5624428,31.837391 C46.8166514,34.9762887 43.4145242,37.0688872 41.4915828,35.4247027 C32.1727127,26.9048375 28.9185041,20.9259847 27.7351555,14.1997753 C26.5518069,7.32409464 30.9893641,-1.13686838e-13 38.6811299,-1.13686838e-13 Z"></path></g></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-pagination-back': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-423.000000, -2747.000000)" fill-rule="nonzero" stroke="#125D9B"><g transform="translate(359.000000, 2734.000000)"><g transform="translate(52.000000, 0.000000)"><g transform="translate(13.000000, 8.000000)"><g transform="translate(-0.000000, 0.000000)"><path d="M6.119624,6.15310327 C6.30520372,6.338683 6.32207461,6.62908496 6.17023665,6.83372327 L6.119624,6.89235127 L1.785,11.227 L14.0757576,11.2272727 C14.3644519,11.2272727 14.5984848,11.4724501 14.5984848,11.7748918 C14.5984848,12.05213 14.4018321,12.2812503 14.1466886,12.3175117 L14.0757576,12.3225108 L1.834,12.322 L6.119624,16.6076487 C6.30520372,16.7932285 6.32207461,17.0836304 6.17023665,17.2882687 L6.119624,17.3468967 C5.93404427,17.5324765 5.64364231,17.5493473 5.439004,17.3975094 L5.380376,17.3468967 L0.304862233,12.2728264 C0.124944067,12.186288 -1.42108547e-14,11.9958758 -1.42108547e-14,11.7748918 L5.22949531e-05,11.757417 C-0.00152597616,11.6454993 0.0326201326,11.5331714 0.102490621,11.439004 L0.153103273,11.380376 L5.380376,6.15310327 C5.5845137,5.94896558 5.9154863,5.94896558 6.119624,6.15310327 Z"></path></g></g></g></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-pagination-end': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 20 13" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-1072.000000, -2747.000000)" fill-rule="nonzero" stroke="#125D9B"><g transform="translate(359.000000, 2734.000000)"><g transform="translate(569.000000, 1.000000)"><g transform="translate(136.000000, 0.000000)"><path d="M26.5606061,13 C26.8252425,13 27.0439482,13.1966527 27.0785614,13.4517963 L27.0833333,13.5227273 L27.0833333,23.9772727 C27.0833333,24.265967 26.8493004,24.5 26.5606061,24.5 C26.2959696,24.5 26.0772639,24.3033473 26.0426507,24.0482037 L26.0378788,23.9772727 L26.0378788,13.5227273 C26.0378788,13.234033 26.2719118,13 26.5606061,13 Z M18.1594808,13.1024906 L18.2181088,13.1531033 L23.4453816,18.380376 L23.4624814,18.3983008 C23.4721371,18.408912 23.4813621,18.4199221 23.4901287,18.4313035 L23.4453816,18.380376 C23.4733883,18.4083827 23.4975526,18.4387767 23.5178745,18.4709031 C23.5269337,18.4852739 23.5356151,18.5006161 23.5435197,18.5164146 C23.548842,18.527027 23.5536105,18.5374464 23.5580188,18.5479808 C23.5654158,18.5656054 23.5719272,18.5838923 23.5774189,18.6026152 C23.5805021,18.613304 23.5832009,18.6237365 23.585573,18.6342279 C23.5894411,18.6510296 23.5925324,18.6687827 23.5947054,18.6868184 C23.5965394,18.7023303 23.597694,18.7174374 23.5981957,18.7325621 C23.5983883,18.7382954 23.5984848,18.7441364 23.5984848,18.75 L23.5975906,18.7806571 C23.596867,18.7930503 23.5957042,18.8054226 23.5941021,18.8177487 L23.5984848,18.75 C23.5984848,18.7901616 23.5939556,18.8292654 23.5853801,18.8668284 C23.5820481,18.8812269 23.5781274,18.8955756 23.5735853,18.9097686 C23.5692285,18.9234948 23.5641329,18.9373447 23.5584825,18.9509055 C23.5535261,18.9628168 23.5481982,18.9744053 23.5424242,18.9858262 C23.5203063,19.0295104 23.4920381,19.0699217 23.458825,19.1056761 L23.4453816,19.119624 L18.2181088,24.3468967 C18.0139711,24.5510344 17.6829985,24.5510344 17.4788608,24.3468967 C17.2932811,24.161317 17.2764102,23.870915 17.4282482,23.6662767 L17.4788608,23.6076487 L21.814,19.272 L9.52272727,19.2727273 C9.23403297,19.2727273 9,19.0386943 9,18.75 C9,18.4853636 9.19665271,18.2666578 9.45179628,18.2320446 L9.52272727,18.2272727 L21.813,18.227 L17.4788608,13.8923513 C17.2932811,13.7067715 17.2764102,13.4163696 17.4282482,13.2117313 L17.4788608,13.1531033 C17.6644406,12.9675235 17.9548425,12.9506527 18.1594808,13.1024906 Z"></path></g></g></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-pagination-next': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-1003.000000, -2747.000000)" fill-rule="nonzero" stroke="#125D9B"><g transform="translate(359.000000, 2734.000000)"><g transform="translate(569.000000, 1.000000)"><g transform="translate(29.000000, 7.000000)"><path d="M56.1594808,6.10249062 L56.2181088,6.15310327 L61.4453816,11.380376 L61.4624814,11.3983008 C61.4721371,11.408912 61.4813621,11.4199221 61.4901287,11.4313035 L61.4453816,11.380376 C61.4733883,11.4083827 61.4975526,11.4387767 61.5178745,11.4709031 C61.5269337,11.4852739 61.5356151,11.5006161 61.5435197,11.5164146 C61.548842,11.527027 61.5536105,11.5374464 61.5580188,11.5479808 C61.5654158,11.5656054 61.5719272,11.5838923 61.5774189,11.6026152 C61.5805021,11.613304 61.5832009,11.6237365 61.585573,11.6342279 C61.5894411,11.6510296 61.5925324,11.6687827 61.5947054,11.6868184 C61.5965394,11.7023303 61.597694,11.7174374 61.5981957,11.7325621 C61.5983883,11.7382954 61.5984848,11.7441364 61.5984848,11.75 L61.5975906,11.7806571 C61.596867,11.7930503 61.5957042,11.8054226 61.5941021,11.8177487 L61.5984848,11.75 C61.5984848,11.7901616 61.5939556,11.8292654 61.5853801,11.8668284 C61.5820481,11.8812269 61.5781274,11.8955756 61.5735853,11.9097686 C61.5692285,11.9234948 61.5641329,11.9373447 61.5584825,11.9509055 C61.5535261,11.9628168 61.5481982,11.9744053 61.5424242,11.9858262 C61.5203063,12.0295104 61.4920381,12.0699217 61.458825,12.1056761 L61.4453816,12.119624 L56.2181088,17.3468967 C56.0139711,17.5510344 55.6829985,17.5510344 55.4788608,17.3468967 C55.2932811,17.161317 55.2764102,16.870915 55.4282482,16.6662767 L55.4788608,16.6076487 L59.814,12.272 L47.5227273,12.2727273 C47.234033,12.2727273 47,12.0386943 47,11.75 C47,11.4853636 47.1966527,11.2666578 47.4517963,11.2320446 L47.5227273,11.2272727 L59.813,11.227 L55.4788608,6.89235127 C55.2932811,6.70677155 55.2764102,6.41636959 55.4282482,6.21173127 L55.4788608,6.15310327 C55.6644406,5.96752355 55.9548425,5.95065266 56.1594808,6.10249062 Z"></path></g></g></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-pagination-start': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-367.000000, -2746.000000)" fill-rule="nonzero" stroke="#125D9B"><g transform="translate(359.000000, 2734.000000)"><path d="M9.54761905,13 C9.82485723,13 10.0539775,13.2021153 10.090239,13.4643462 L10.0952381,13.5372475 L10.0952381,24.282197 C10.0952381,24.5789106 9.8500607,24.8194444 9.54761905,24.8194444 C9.27038087,24.8194444 9.04126057,24.6173292 9.00499912,24.3550983 L9,24.282197 L9,13.5372475 C9,13.2405339 9.2451774,13 9.54761905,13 Z M18.6044725,13.1573561 C18.7900522,13.3480909 18.8069231,13.6465595 18.6550851,13.8568823 L18.6044725,13.9171388 L14.269,18.372 L26.5606061,18.3724747 C26.8493004,18.3724747 27.0833333,18.6244626 27.0833333,18.9353054 C27.0833333,19.2202447 26.8866806,19.4557294 26.6315371,19.4929981 L26.5606061,19.4981361 L14.32,19.498 L18.6044725,23.9023056 C18.7900522,24.0930404 18.8069231,24.391509 18.6550851,24.6018317 L18.6044725,24.6620883 C18.4188928,24.852823 18.1284908,24.8701625 17.9238525,24.7141069 L17.8652245,24.6620883 L12.7887263,19.4465836 C12.609337,19.3574149 12.4848485,19.1620135 12.4848485,18.9353054 L12.4848975,18.9023424 C12.486359,18.792316 12.5205062,18.682663 12.5873391,18.5900874 L12.6379518,18.5298309 L17.8652245,13.1573561 C18.0693622,12.947548 18.4003348,12.947548 18.6044725,13.1573561 Z"></path></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-new-window': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-481.000000, -4297.000000)" fill-rule="nonzero"><g transform="translate(0.000000, 3870.000000)"><g transform="translate(250.000000, 80.000000)"><g transform="translate(0.000000, 263.000000)"><g transform="translate(153.000000, 81.000000)"><path d="M81.7685378,3.35 L81.7685378,4.65 L79.3,4.65 L79.3,12.35 L87,12.35 L87,10.0048044 L88.3,10.0048044 L88.3,13.65 L78,13.65 L78,3.35 L81.7685378,3.35 Z M88.3,3.35 L88.3,8 L87,8 L86.999,5.59 L82.6139635,10.0607026 L81.6860365,9.15023488 L86.102,4.649 L83.65,4.65 L83.65,3.35 L88.3,3.35 Z"></path></g></g></g></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-modal-close': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 19 20" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-1290.000000, -3459.000000)" fill-rule="nonzero"><g><path d="M1306.92462,3459.45406 L1309.04594,3461.57538 L1301.62106,3469.00006 L1309.04594,3476.42462 L1306.92462,3478.54594 L1299.50006,3471.12106 L1292.07538,3478.54594 L1289.95406,3476.42462 L1297.37906,3469.00006 L1289.95406,3461.57538 L1292.07538,3459.45406 L1299.50006,3466.87906 L1306.92462,3459.45406 Z"></path></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-modal-left': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 22 39" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-148.000000, -3854.000000)" fill-rule="nonzero"><g><path d="M157,3860 L157,3884 L181,3884 L181,3887 L154,3887 L154,3860 L157,3860 Z" transform="translate(167.500000, 3873.500000) rotate(45.000000) translate(-167.500000, -3873.500000) "></path></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-modal-right': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 22 39" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill-rule="evenodd"><g transform="translate(-1289.000000, -3854.000000)" fill-rule="nonzero"><g><path d="M1280.59188,3860 L1280.59188,3884 L1304.59188,3884 L1304.59188,3887 L1277.59188,3887 L1277.59188,3860 L1280.59188,3860 Z" transform="translate(1291.091883, 3873.500000) rotate(225.000000) translate(-1291.091883, -3873.500000) "></path></g></g></g></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-plus': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 10 11" xmlns="http://www.w3.org/2000/svg"><path d="M3.72 10.7267V0.846748H6.16V10.7267H3.72ZM0.1 6.90675V4.66675H9.78V6.90675H0.1Z" /></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-minus': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 11 4" xmlns="http://www.w3.org/2000/svg"><path d="M0.36 3.01518V0.835175H10.06V3.01518H0.36Z" /></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-play': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1458_14271)"><path d="M10 16.5L16 12L10 7.5V16.5ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/></g><defs><clipPath id="clip0_1458_14271"><rect width="24" height="24"/></clipPath></defs></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-pause': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1458_26761)"><path d="M9 16H11V8H9V16ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 16H15V8H13V16Z"/></g><defs><clipPath id="clip0_1458_26761"><rect width="24" height="24"/></clipPath></defs></svg>'
            )}') no-repeat 50% 50%`,
          },
          // Just the circle-outline shared by the above play/pause masks. Can be used as basis for a loading spinner.
          '.mask-play-pause-circle': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1458_14271)"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/></g><defs><clipPath id="clip0_1458_14271"><rect width="24" height="24"/></clipPath></defs></svg>'
            )}') no-repeat 50% 50%`,
          },
          '.mask-tablesort': {
            mask: `url('data:image/svg+xml,${encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="#787878" d="M13.391 10.607c.17.216.084.393-.191.393h-10.398c-.275 0-.361-.177-.191-.393l5.08-6.464c.17-.216.45-.216.62 0l5.08 6.464z"/></svg>'
            )}') no-repeat 50% 50%`,
          },

          /*
            Use this one if there's need to accept *arbitrary* mask-images.
            Requires a `--tw-mask-image` CSS variable in scope, like:

            style="--tw-mask-image: url('{{ imagePath }}')"
            class="mask-custom"

            (the `imagePath` must be passed in as a variable and not hard-coded
            b/c filepath in Storybook and filepath in the CMS will differ)

            Avoid using inline SVG-markup for the image (b/c of code-duplication),
            but if it's absolutely necessary then remember to use url-escaping:

            --tw-mask-image: url('data:image/svg+xml,{{ svg|escape('url') }}')
          */
          '.mask-custom': { mask: 'var(--tw-mask-image) no-repeat 50% 50%' },
          '.mask-custom-2': {
            mask: 'var(--tw-mask-image-2) no-repeat 50% 50%',
          },

          // good w/ `mask-custom` to override an SVG's baked-in width & height
          '.mask-contain': { maskSize: 'contain' },

          '.mask-repeat': { maskRepeat: 'repeat' },
        });

        // misc. utilities
        addUtilities({
          '.details-marker-none': {
            /* tw */ '@apply list-none': '',
            '&::-webkit-details-marker': {
              /* tw */ '@apply hidden': '',
            },
          },

          // just an alias
          '.visually-hidden': { /* tw */ '@apply sr-only': '' },

          '.clip-path-circle': { clipPath: 'circle()' },
        });

        /* CUSTOM VARIANTS */

        // hocus
        addVariant('hocus', [
          '@media (hover: hover) and (pointer: fine) { &:hover }',
          '&:focus-visible',
        ]);

        // group-hocus / group-hocus/{name}
        matchVariant(
          'group',
          (_value, { modifier }) =>
            modifier
              ? [
                  `@media (hover: hover) and (pointer: fine) { :merge(.group\\/${modifier}):hover & }`,
                  `:merge(.group\\/${modifier}):focus-visible &`,
                ]
              : [
                  `@media (hover: hover) and (pointer: fine) { :merge(.group):hover & }`,
                  `:merge(.group):focus-visible &`,
                ],
          { values: { hocus: 'hocus' } }
        );

        // peer-hocus / peer-hocus/{name}
        matchVariant(
          'peer',
          (_value, { modifier }) =>
            modifier
              ? [
                  `@media (hover: hover) and (pointer: fine) { :merge(.peer\\/${modifier}):hover ~ & }`,
                  `:merge(.peer\\/${modifier}):focus-visible ~ &`,
                ]
              : [
                  `@media (hover: hover) and (pointer: fine) { :merge(.peer):hover ~ & }`,
                  `:merge(.peer):focus-visible ~ &`,
                ],
          { values: { hocus: 'hocus' } }
        );

        addVariant('children', '& > *');
        addVariant('descendants', '& *');

        // for targeting only Safari (which also means ALL browsers on iOS); only use as a last resort
        // (disabling for now because I'm not sure if it even still works!)
        // addVariant('safari', '_::-webkit-full-page-media, _:future, :root &');

        /*
          For when container-query mechanism on main-area-against-sidebar won't do (needs a
          `.with-sidebar` ancestor IFF a sidebar is present; see `Page.twig`).
          If need to combine with a container-query breakpoint, just proceed as
          normal (like `sm:with-sidebar:`). If, however, you need to combine with
          a MEDIA-query breakpoint, then you'll also need the `.no-container-query` class
          on the element (or have a `.no-container-query-deep` higher up), like
          `class="no-container-query xl:with-sidebar:..."`.
          But also see the `with-sidebar-up:` variant just below, which is probably
          better to use in practice.
        */
        addVariant('with-sidebar', '&:is(.with-sidebar *)');
        addVariant('no-sidebar', '&:not(.with-sidebar *)');

        /*
          This is just like the `with-sidebar` variant above but it ONLY kicks in when the sidebar is
          actually up. Probably want to use this most of the time, because there's no chance of
          inadvertently using it in a way that affects the element in question when the screen
          is below the `sidebar-up` breakpoint.
          IMPORTANT NOTE: if you combine this with a container-query breakpoint, then the TW
          breakpoint-variant MUST COME FIRST, like `sm:with-sidebar-up` (not `with-sidebar-up:sm`).
          This is because of how our custom PostCSS plugin for making the container-query rules
          works (admittedly it's a *shortcoming* of how it works). For MEDIA-QUERIES (i.e.,
          accompanied by `.no-container-query`), either order should work.
        */
        addVariant(
          'with-sidebar-up',
          '@screen sidebar-up { &:is(.with-sidebar *) }'
        );

        /*
          Use these to target something that is inside (or is itself) the first- or last- child of the
          sidebar or the main-area-against-sidebar when the viewport is wide enough for the sidebar to be up.
          Good for managing vertical rhythm.
          Requires that the `.with-sidebar__main-inner-wrapper` class (applied in `Page.twig`) is
          indeed the innermost wrapper of the main-region that contains the "slabs" against the
          sidebar, and likewise for the `.with-sidebar__sidebar-inner-wrapper` class in the sidebar-region.
        */
        // with-sidebar__sidebar
        addVariant('with-sidebar-up-first', [
          '@screen sidebar-up { &:is(.with-sidebar__main-inner-wrapper > :first-child, .with-sidebar__main-inner-wrapper > :first-child *) }',
          '@screen sidebar-up { &:is(.with-sidebar__sidebar-inner-wrapper > :first-child, .with-sidebar__sidebar-inner-wrapper > :first-child *) }',
        ]);
        addVariant('with-sidebar-up-last', [
          '@screen sidebar-up { &:is(.with-sidebar__main-inner-wrapper > :last-child, .with-sidebar__main-inner-wrapper > :last-child *) }',
          '@screen sidebar-up { &:is(.with-sidebar__sidebar-inner-wrapper > :last-child, .with-sidebar__sidebar-inner-wrapper > :last-child *) }',
        ]);

        addVariant('wysiwyg-embed', '&:is(.wysiwyg-embed *)');
        addVariant('not-wysiwyg-embed', '&:not(.wysiwyg-embed *)');

        addVariant(
          'wysiwyg-embed-first',
          '&:is(.wysiwyg-embed > :first-child, .wysiwyg-embed > :first-child *)'
        );

        addVariant(
          'wysiwyg-embed-last',
          '&:is(.wysiwyg-embed > :last-child, .wysiwyg-embed > :last-child *)'
        );

        addVariant('constrained-content', '&:is(.constrained-content *)');
        addVariant('not-constrained-content', '&:not(.constrained-content *)');

        /*
          THEMING VARIANTS

          Earlier in this file, there's a `themeNames` array, and some configuration
          for a CSS-variables approach to theming. Here, we make a TW variant for
          each theme in the `themeNames` array, so that we have both a CSS-variables
          approach and a Tailwind-variant approach at our disposal. They can be used
          together.

          As mentioned earlier, the theme "flags" are `data-tw-theme` attributes
          (e.g., `data-tw-theme="purple"`).

          NOTE: Never use empty `data-tw-theme` attributes, and avoid redundant ones. The
          CSS selectors in use here are powerful but somewhat fragile.

          The theme variants themselves all get prefixed w/ `theme-` (e.g., the "default"
          theme is used like `data-tw-theme="default"` and `theme-default:bg-black`).

          The mechanism here supports some "nesting" of themes.
          For instance, the `default` theme wins out in the following example,
          regardless of the order of CSS declarations in the stylesheet (in fact,
          the `theme-alt:bg-black` class would do nothing here, even if the
          `theme-default:bg-white` class weren't present):

          <div data-tw-theme="alt">
            <div data-tw-theme="default">
              <div class="theme-default:bg-white theme-alt:bg-black"></div>
            </div>
          </div>

          Note, however, that *inherited* CSS properties set within one theme-scope will
          NOT "turn off" in a nested theme-scope. For example, the text-color will still
          be white in the innermost div here:

          <div data-tw-theme="alt">
            <div class="theme-alt:text-white">
              <div data-tw-theme="default">
                <div>This text is white</div>
              </div>
            </div>
          </div>

          Inherited properties set with theme-variants must be explicitly overwritten
          if you want to "turn them off" (e.g., w/ `theme-default:text-black` on that innermost div).
          Each theme "flag" simply ENABLES use of the corresponding theme-variant
          (and DISABLES use of the others). (And of course each theme flag also updates the values
          of any CSS variables you may have set up earlier in this config file.)
        */

        [...new Set(themeNames)].forEach((themeName, i) => {
          // first element is always default theme
          const isDefault = !i;

          const themeFlag = `[data-tw-theme="${themeName}"]`;
          const genericFlag = '[data-tw-theme]';

          addVariant(`theme-${themeName}`, [
            ...(isDefault ? [`&:not(${genericFlag} *)`] : []),
            `&:is(${themeFlag} *):not(${themeFlag} ${genericFlag} *)`,
            `&:is(${themeFlag} ${themeFlag} *)`,
          ]);

          if (isDefault) {
            // will catch any theme except for the default theme (and will exclude the no-theme case)
            addVariant(`theme-not-${themeName}`, [
              `&:is(${genericFlag} *):not(${themeFlag} *)`,
              `&:is(${themeFlag} ${genericFlag} *):not(${themeFlag} ${themeFlag} *)`,
            ]);
          }
        });

        // this will catch any theme, including default, but will exclude the no-theme case
        addVariant('theme-any', `&:is([data-tw-theme] *)`);

        // for the no-theme case (will even exclude explicitly set default-theme)
        addVariant('theme-none', `&:not([data-tw-theme] *)`);

        /*
          DON'T PUT ANY MORE CUSTOM PLUGINS BELOW WHAT FOLLOWS!
          All custom group/peer variants declared with `matchVariant()`
          (as opposed to `addVariant()`) must be declared ABOVE this
          point in the file. The reason is that in arbitrary-variant
          situations involving `group` or `peer` (like `group-[&.foo]:`),
          the LAST DECLARED `matchVariant()` that "matches" `group` or
          `peer` is what's used, and that means that any custom group/peer
          `matchVariant()` we declare will OVERRIDE core Tailwind's.
          Therefore our FINAL custom group/peer `matchVariant()` variants
          must simply duplicate the logic in core Tailwind's group/peer
          `matchVariant()` (to get the behavior right for arbitrary variants),
          and that's what we do directly below (it's copied straight from
          TW's `corePlugins.js` file, more or less).
        */
        /* eslint-disable */
        const defaultGroupPeerVariants = {
          group: (_, { modifier }) =>
            modifier
              ? [`:merge(.group\\/${escapeClassName(modifier)})`, ' &']
              : [`:merge(.group)`, ' &'],
          peer: (_, { modifier }) =>
            modifier
              ? [`:merge(.peer\\/${escapeClassName(modifier)})`, ' ~ &']
              : [`:merge(.peer)`, ' ~ &'],
        };
        for (const [name, fn] of Object.entries(defaultGroupPeerVariants)) {
          // @ts-ignore
          matchVariant(name, (value = '', extra) => {
            let result = normalize(
              // @ts-ignore
              typeof value === 'function' ? value(extra) : value
            );
            if (!result.includes('&')) result = '&' + result;

            // @ts-ignore
            const [a, b] = fn('', extra);

            let start = null;
            let end = null;
            let quotes = 0;

            for (let i = 0; i < result.length; ++i) {
              const c = result[i];
              if (c === '&') {
                start = i;
              } else if (c === "'" || c === '"') {
                quotes += 1;
              } else if (start !== null && c === ' ' && !quotes) {
                end = i;
              }
            }

            if (start !== null && end === null) {
              end = result.length;
            }

            // Basically this but can handle quotes:
            // result.replace(/&(\S+)?/g, (_, pseudo = '') => a + pseudo + b)
            return (
              // @ts-ignore
              result.slice(0, start) +
              a +
              // @ts-ignore
              result.slice(start + 1, end) +
              b +
              // @ts-ignore
              result.slice(end)
            );
          });
        }
        // (END GROUP/PEER STUFF COPIED FROM CORE TW)
        /* eslint-enable */
        // DON'T PUT ANYTHING BELOW THIS (SEE COMMENT ABOVE FOR EXPLANATION)
      }
    ),
  ],

  // TW will only look for used utility-classes in these files
  content: ['./components/**/*.{twig,js,ts}'],

  /*
    Here, list any TW utilities/components that must be available in CMS, regardless
    of whether they're used in any of the files specified in `content` above.
  */
  safelist: [
    {
      pattern: /^(?:my|mt|mb)-vertical-space$/,
      variants: Object.keys(containerBreakpoints),
    },
    /* tw */ 'responsive-embed',
    /* tw */ 'visually-hidden',
    /* tw */ 'sr-only',
  ],
};
