const {
  TwingEnvironment,
  // TwingLoaderRelativeFilesystem,
  TwingLoaderFilesystem,
  TwingFilter,
  TwingMarkup,
  TwingFunction,
} = require('twing');
const { addDrupalExtensions } = require('drupal-twig-extensions/twing');

// const twing = new TwingEnvironment(new TwingLoaderRelativeFilesystem(), {
//   autoescape: false,
// });

const twingLoader = new TwingLoaderFilesystem();

if (twingLoader.addPath) {
  twingLoader.addPath('components', 'components');
}

const twing = new TwingEnvironment(twingLoader, {
  autoescape: false,
});

addDrupalExtensions(twing);

// API: https://nightlycommit.github.io/twing/advanced.html
// Note: all the Function/Filter functions must return Promises in Twing (just make them `async`).

/*
  So that we can do, e.g.:

  {{ button|inject_template }}

  (this mechanism allows us to avoid dealing with async/Promise stuff in the `.stories` files).

  Use the function exported from `components/_ts-helpers/make-component-injector.ts` to create
  the injectables (like `button` above).

  Requires a "no-op" custom `inject_template` filter on the CMS side, which might look something like this:

  $twig->addFilter( new Twig_Filter( 'inject_template', function passthrough_function( $value ) {
      return $value;
  } ) );

  Note: the `inject_template` filter *IN THIS REPO* also supports passing in
  additional context at the injection site, like:

  {{ button|inject_template({ foo: 'bar', fizz: 'buzz' }) }}

  BUT, you MUST NOT DO THIS unless the corresponding custom filter on the CMS-side has been
  configured for the same (the "no-op" version above won't cut it). This extra mechanism is
  extremely useful, but it's simply a no-go unless it will work on the CMS, too. If, however,
  this repo is for a front-end-only situation, where someone else will be doing the back-end
  implementation without using the actual Twig files directly, then it's a good thing to use.
  (Using this extra mechanism also requires including a `twigContextKeys` property on the
  object you feed to the `makeComponentInjector()` function.)

  You can call this filter on a string or an instance of TwingMarkup (i.e., markup
  defined in a `{% set %}` block), and it will just return the string/markup.
  This is useful when occasionally it makes sense for a variable to be, say,
  *either* an Editorial-template injection *or* just a chunk of markup
  (e.g., for a "generic slab").
*/
twing.addFilter(
  new TwingFilter('inject_template', async (fnOrStrOrTwingMarkup, context) => {
    if (context && !(context instanceof Map)) {
      console.warn(
        'If you pass an argument to the `|inject_template` filter, it must be an object.'
      );
      return '';
    }

    if (typeof fnOrStrOrTwingMarkup === 'function') {
      return context
        ? fnOrStrOrTwingMarkup(Object.fromEntries(context.entries()))
        : fnOrStrOrTwingMarkup();
    }

    if (
      typeof fnOrStrOrTwingMarkup === 'string' ||
      fnOrStrOrTwingMarkup instanceof TwingMarkup
    ) {
      return fnOrStrOrTwingMarkup;
    }

    return '';
  })
);

twing.addFunction(new TwingFunction('children', async () => []));

twing.addFunction(
  new TwingFunction(
    'icon',
    async (name) =>
      `<img src="http://place-hold.it/18x18" alt="placeholder for ${name} icon">`
  )
);

// Check for a Drupal render array, never true in Storybook.
twing.addFunction(new TwingFunction('is_render_array', async () => false));

// Menu function to determine whether the current item is the current page.
twing.addFunction(
  new TwingFunction(
    'active_and_no_active_below',
    async (item) => item?.is_current
  )
);

/**
 * Mock https://twig-extensions.readthedocs.io/en/latest/intl.html#localizeddate
 */
twing.addFilter(
  new TwingFilter('localizeddate', async (str) => {
    const d = new Date(str * 1000);
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return d.toLocaleString(undefined, options);
  })
);

twing.addFilter(new TwingFilter('nocomment', async (s) => s));

module.exports = twing;
