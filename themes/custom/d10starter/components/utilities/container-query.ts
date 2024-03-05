/*
  Based on https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/
  but with a twist: we hook into pre-existing responsive TW classes to automate/streamline things.

  Works in conjunction with a custom PostCSS plugin that creates the rules we'll need.

  Handles dynamically added elements, too, and also dynamically added classes to existing
  container-query descendants. Does NOT handle dynamically added/removed flag for
  container-query ancestors (`data-container-query-ancestor`); unlikely that scenario
  would ever arise, but could probably adjust this script to accommodate it if needed.

  The mechanism accounts for the user's up-to-date base-level font-size, so that it's like
  using rem-values for the container-query min-widths. This provides better results when
  doing text-only zoom (which is also why we should use rem or em for media-query values
  to begin with, but that isn't a requirement here).
*/

const setUpContainerQueries = () => {
  // get Tailwind screens
  const SCREENS = preval`
    const fs = require('fs');
    const config = JSON.parse(fs.readFileSync('/app/full-tailwind-config.json'));
    module.exports = config.theme.screens;
  ` as Record<string, string | { min?: string }>;

  // probably have polyfill.io script grab these if necessary
  if (
    !window.ResizeObserver ||
    !window.MutationObserver ||
    !Object.entries ||
    !Array.prototype.flatMap ||
    !window.Map
  )
    return;

  const isRemOrEmOrPxString = (s: string) => /(?:em|px)$/.test(s);

  /**
   * The `remOrEmOrPxString` parameter should be like '768px' or '48rem' or '48em'.
   * Used to establish a "baseline" px-value for min-width media-query values.
   * Later we'll account for the actual base font-size (which can depend on the
   * user's text-zoom level), so that the effect is similar to using rem.
   */
  const getBasePxValue = (remOrEmOrPxString: string) => {
    const n = parseFloat(remOrEmOrPxString);
    return remOrEmOrPxString.endsWith('px') ? n : n * 16;
  };

  // we want just the min-width breakpoints (minus `'sidebar-up'`), and we want the pixel-values as numbers
  const breakpoints = new Map(
    Object.entries(SCREENS).flatMap(([key, value]) => {
      if (key === 'sidebar-up') return [];
      if (typeof value === 'string')
        return isRemOrEmOrPxString(value) ? [[key, getBasePxValue(value)]] : [];
      if (value.min)
        return isRemOrEmOrPxString(value.min)
          ? [[key, getBasePxValue(value.min)]]
          : [];
      return [];
    })
  );

  const breakpointNames = Array.from(breakpoints.keys());

  /**
   * Matches responsive-variant and stores it in capturing group 2;
   * capturing group 1 gets whatever comes immediately before it.
   * No global flag used here (i.e., safe for `RegExp.prototype.test()`).
   * For default TW breakpoints, looks like: `/(^|:|\s)(sm|md|lg|xl|2xl)(?=:)/`.
   * Note: can't use look-behind assertion for first part because Safari
   * still doesn't support it (as of Safari 15).
   */
  const responsiveVariantsTester = new RegExp(
    `(^|:|\\s)(${breakpointNames.join('|')})(?=:)`
  );

  /**
   * Global-flag version of {@link responsiveVariantsTester `responsiveVariantsTester`}
   * (i.e., matches responsive-variant but gives replace-all behavior with
   * `String.prototype.replace()` and is unsafe for `RegExp.prototype.test()`).
   * For default TW breakpoints, looks like: `/(^|:|\s)(sm|md|lg|xl|2xl)(?=:)/g`
   */
  const responsiveVariants = new RegExp(responsiveVariantsTester.source, 'g');

  /** Selector that flags an element as a container-query ancestor */
  const ancestorSelector = '[data-container-query-ancestor]';

  /** Selector indicating that an element should stay responsive to SCREEN-width (instead of CONTAINER-width) */
  const escapeHatchSelector = '.no-container-query';

  /** Selector indicating that an element *and all of its descendants* should stay responsive to SCREEN-width (instead of CONTAINER-width) */
  const deepEscapeHatchSelector = '.no-container-query-deep';

  /**
   * Prefixes each responsive-variant with an underscore in provided element's `className`.
   * Does not reassign `className` if no changes need to be made, making this safe to use
   * in {@link classMutationObserver `classMutationObserver`}'s callback (which fires in
   * response to class-changes and so would otherwise be vulnerable to infinite-loops).
   */
  const transform = (descendant: Element) => {
    if (responsiveVariantsTester.test(descendant.className)) {
      descendant.className = descendant.className.replace(
        responsiveVariants,
        '$1_$2'
      );
    }
  };

  /**
   * Watches for class-changes to container-query descendants, so that dynamically
   * added classes with responsive variants like `sm:` are immediately transformed
   * to underscore-prefixed equivalents like `_sm:`.
   */
  const classMutationObserver = new MutationObserver((mutationRecords) => {
    for (const { target } of mutationRecords) {
      if (target instanceof Element) {
        transform(target);
      }
    }
  });

  /**
   * Calls {@link transform `transform`} on provided container-query descendant and
   * watches it with `classMutationObserver`.
   */
  const transformAndObserve = (descendant: Element) => {
    transform(descendant);
    classMutationObserver.observe(descendant, { attributeFilter: ['class'] });
  };

  /**
   * Calls {@link transformAndObserve `transformAndObserve`} on all non-escape-hatched
   * descendants of provided container-query ancestor.
   */
  const transformAndObserveDescendants = (ancestor: Element) => {
    // Is this fast enough? Maybe `getElementsByTag('*')` or a NodeIterator or TreeWalker would be better?
    for (const descendant of ancestor.querySelectorAll(
      `:not(${escapeHatchSelector}):not(${deepEscapeHatchSelector}):not(${deepEscapeHatchSelector} *), ${deepEscapeHatchSelector} ${ancestorSelector} :not(${escapeHatchSelector})`
    )) {
      transformAndObserve(descendant);
    }
  };

  /**
   * Calls {@link transformAndObserveDescendants `transformAndObserveDescendants`} on provided
   * container-query ancestor, but only if said ancestor is not a NESTED ancestor (because then
   * the outer ancestor will already have done the trick).
   */
  const selectivelyTransformAndObserveDescendants = (ancestor: Element) => {
    if (!ancestor.matches(`${ancestorSelector} ${ancestorSelector}`)) {
      transformAndObserveDescendants(ancestor);
    }
  };

  // see `resizeObserver` below (cached value to prevent unneeded `window.matchMedia()` calls)
  let mQAccountsForScrollbarCache: boolean | undefined = undefined;

  /**
   * Observes container-query ancestors, causing them to get/lose classes like `_sm` based
   * on their width. (Our custom PostCSS plugin creates the relevant CSS rules.)
   */
  const resizeObserver = new ResizeObserver((entries) => {
    // Account for current base-level font-size so that it's like using rem (better results on text-only zoom)
    const currentBaseFontSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize
    );

    const adjustedBreakpoints = new Map(
      Array.from(breakpoints.entries()).map(([breakpointName, rawMinWidth]) => [
        breakpointName,
        (rawMinWidth * currentBaseFontSize) / 16,
      ])
    );

    /*
      Situationally, we have to account for the window's (current) vertical-scrollbar
      width, because media-queries (in most browsers) DO account for scrollbar-width,
      and sometimes the container-query must *exactly* emulate the corresponding
      media-query (e.g., in the against-sidebar area when the screen is narrower
      than the sidebar-up breakpoint) -- otherwise, we can get undesirable results in
      edge cases. However, we *only* want to account for the scrollbar-width in those
      scenarios. To check if the condition is met, first we'll determine whether the
      browser accounts for scrollbar-width in media-queries (they're supposed to,
      and at the time of writing I think only Safari doesn't, but we'll check for it
      as needed). Then, IF the browser does that, then we'll compare the document-width
      with the width of the container-query ancestor: if they're equal, then we do
      need to account for the scrollbar-width; if they're not, then we don't.
    */
    const documentWidth = document.documentElement.offsetWidth;
    const scrollbarWidth = window.innerWidth - documentWidth;

    let mQAccountsForScrollbar: boolean | undefined = undefined;

    /*
      If `mQAccountsForScrollbar` has already been determined, use that cached value.
      Otherwise:
        - if there's a scrollbar to test with, then determine the value and cache it
        - if there isn't, then we actually don't care right now, so just move on
    */
    if (typeof mQAccountsForScrollbarCache === 'boolean') {
      mQAccountsForScrollbar = mQAccountsForScrollbarCache;
    } else if (scrollbarWidth) {
      const mQTest = !window.matchMedia(
        `screen and (max-width: ${window.innerWidth - scrollbarWidth}px)`
      ).matches;
      mQAccountsForScrollbarCache = mQTest;
      mQAccountsForScrollbar = mQTest;
    }

    for (const entry of entries) {
      let width: number | undefined = undefined;

      /*
        We should probably use `borderBoxSize` instead, but Safari < 15.4 only has
        `contentRect` (not even `contentBoxSize`!), so to avoid having to do any
        calculations here for Safari (where bugs might ONLY be detectable in that
        browser), we'll just use `contentBoxSize` for non-Safari and be careful to
        never allow container-query ancestors to have x-padding or x-border
        (which is why we use `!px-0 !border-x-0` in `container-query.twig`).
      */
      if (entry.contentBoxSize) {
        width =
          entry.contentBoxSize instanceof ResizeObserverSize
            ? entry.contentBoxSize.inlineSize
            : entry.contentBoxSize[0]!.inlineSize;
      } else {
        width = entry.contentRect.width;
      }

      /*
        If needed, check whether `documentWidth` and `width` are equal, but
        leave a little "wiggle room" (not sure if wiggle room is necessary,
        but I think it can't hurt).
      */
      const accountForScrollbarWidth =
        mQAccountsForScrollbar && Math.abs(documentWidth - width) < 3;

      for (const [breakpointName, minWidth] of adjustedBreakpoints) {
        const adjustedMinWidth = accountForScrollbarWidth
          ? minWidth - scrollbarWidth
          : minWidth;

        if (width >= adjustedMinWidth) {
          entry.target.classList.add(`_${breakpointName}`);
        } else {
          entry.target.classList.remove(`_${breakpointName}`);
        }
      }
    }
  });

  // on page-load, set up basic container-query mechanism
  for (const ancestor of document.querySelectorAll(ancestorSelector)) {
    /*
      Observe ancestor FIRST, b/c better to have descendants "flash" just once, from
      screen-query styles directly to container-query styles (though the down-side is
      that it won't happen all at once, since we'll have to loop through the descendants
      to modify their classes). Doing it the other way goes from screen-query styles to
      NO query styles to container-query styles. I think that's worse, but if I'm wrong
      we can always reverse these (and would have to do a similar reversal in the
      `mutationObserver` callback below). Probably not a big deal anyway, since use-case
      would pretty much always be below the fold.
    */
    resizeObserver.observe(ancestor);
    selectivelyTransformAndObserveDescendants(ancestor);
  }

  /**
   * Watches for changes to DOM (in `body`), and integrates any newly added
   * container-query-related elements into the system by:
   * 1. observing new container-query ancestors with {@link resizeObserver `resizeObserver`};
   * 2. transforming new container-query descendants and observing them w/ {@link classMutationObserver `classMutationObserver`}.
   */
  const mutationObserver = new MutationObserver((mutationRecords) => {
    for (const mutationRecord of mutationRecords) {
      for (const node of mutationRecord.addedNodes) {
        if (!(node instanceof Element)) continue;

        /** for keeping track of newly added container-query ancestors */
        const newAncestors = [];

        const nodeIsAncestor = node.matches(ancestorSelector);
        const nodeIsDescendant = node.matches(`${ancestorSelector} *`);

        // If added node is a new container-query ancestor, add it to the array...
        if (nodeIsAncestor) newAncestors.push(node);

        // ...and do the same for any new container-query ancestors among node's descendants.
        // (skip `<optgroup>` b/c errors in Chrome at least)
        if (!(node instanceof HTMLOptGroupElement)) {
          for (const ancestor of node.querySelectorAll(ancestorSelector)) {
            newAncestors.push(ancestor);
          }
        }

        /*
          Observe the new container-query ancestors w/ the ResizeObserver. We do this
          BEFORE transforming the descendant classes for the reasons explained above
          (where we used this ordering on page-load).
        */
        for (const ancestor of newAncestors) {
          resizeObserver.observe(ancestor);
        }

        // Now transform/observe responsive variants of added node if applicable...
        if (
          nodeIsDescendant &&
          !node.matches(escapeHatchSelector) &&
          !node.matches(deepEscapeHatchSelector) &&
          (!node.matches(`${deepEscapeHatchSelector} *`) ||
            node.matches(
              `${deepEscapeHatchSelector} ${ancestorSelector} :not(${escapeHatchSelector})`
            ))
        ) {
          transformAndObserve(node);
        }

        // ...and do the same for added node's descendants, based on conditions:
        if (nodeIsDescendant || nodeIsAncestor) {
          /*
            If `node` is container-query ancestor or descendant, then target ALL non-escape-hatched descendants
            (because they're all new container-query descendants that haven't been processed yet).
          */
          transformAndObserveDescendants(node);
        } else {
          /*
            Otherwise, the situation inside `node` is just like the situation with the whole DOM was
            on page-load, so give it the same "selective" treatment.
          */
          for (const ancestor of newAncestors) {
            selectivelyTransformAndObserveDescendants(ancestor);
          }
        }
      }
    }
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // In Storybook, add observers to global store so we can disconnect them in script-runner on story-change
  if (window.IS_STORYBOOK && window.observers) {
    [resizeObserver, mutationObserver, classMutationObserver].forEach(
      (observer) => window.observers!.add(observer)
    );
  }
};

if (!window.IS_STORYBOOK) setUpContainerQueries();

export default setUpContainerQueries;
