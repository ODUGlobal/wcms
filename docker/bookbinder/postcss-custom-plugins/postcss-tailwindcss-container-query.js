/* 

  This custom PostCSS plugin takes responsive Tailwind rules like:

  @media (min-width: 640px) {
    .sm\:mt-10 {
      margin-top: 2.5rem;
    }
  }

  and creates new rules based on them like this:

  ._sm ._sm\:mt-10:not(._sm [data-container-query-ancestor] *),
  [data-container-query-ancestor] ._sm ._sm\:mt-10 {
    margin-top: 2.5rem;
  }

  Then when we use the ResizeObserver API to set up container-queries, we
  already have all the CSS rules we need. Further: the client-side JS
  that sets up our ResizeObserver (`container-query.ts`, or `container-query.js`
  on the CMS side) also replaces any classes like `.sm:` with `._sm:` on all
  elements within the container. This way, we can always just use the normal
  Tailwind `.sm:` classes in development.

  Those selectors we're using support ONE layer of nesting
  (i.e., `[data-container-query-ancestor] [data-container-query-ancestor]` is okay, but
  not `[data-container-query-ancestor] [data-container-query-ancestor] [data-container-query-ancestor]`).
  If needed, could probably add one more layer.

  Also, the responsive-variant doesn't have to come first; e.g., `peer-hover:sm:mt-10`
  should get processed correctly, too.
*/

const fs = require('fs');
const {
  default: _escapeClassName,
} = require('tailwindcss/lib/util/escapeClassName');

/**
 * @param {string} s
 * @returns {string}
 */
const escapeClassName = (s) => _escapeClassName(s);

/** @param {string} str */
const regExpEscape = (str) => str.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');

/**
 * @param {Object} options
 * @param {string} options.containerQueryAncestorSelector
 * @returns {import('postcss').Plugin}
 */
module.exports = ({
  containerQueryAncestorSelector = '[data-container-query-ancestor]',
}) => {
  /** @type {{ theme: { screens: Record<string, string | { min?: string }> } }} */
  const tailwindConfig = JSON.parse(
    fs.readFileSync('/app/full-tailwind-config.json')
  );

  /*
    We want just the min-width breakpoints (except for `'sidebar-up'`, which
    should NEVER be a container-query variant). The key for each entry is
    the media-query string, like '(min-width: 640px)', and the value
    is an array with 1 or 2 elements: the breakpoint's CSS-escaped name
    and, if it's different, the breakpoint's UNESCAPED name (we need both
    for the regex, b/c responsive variant is only escaped if it comes
    FIRST, but responsive variant doesn't have to come first).
  */
  const breakpointNames = new Map(
    Object.entries(tailwindConfig.theme.screens).flatMap(([key, value]) => {
      if (key === 'sidebar-up') return [];
      if (typeof value === 'string')
        return [
          [
            `(min-width: ${value})`,
            Array.from(new Set([escapeClassName(key), key])),
          ],
        ];
      if (value.min)
        return [
          [
            `(min-width: ${value.min})`,
            Array.from(new Set([escapeClassName(key), key])),
          ],
        ];
      return [];
    })
  );

  /*
    This regex finds a class's responsive-variant (if there is one) and stores it in
    capturing group 1. Looks like this for the default Tailwind breakpoints:

    /(?<=\.|\\:)(sm|md|lg|xl|\\32xl|2xl)(?=\\:)/

    (it needs both CSS-escaped version and un-escaped version if they differ, b/c
    whether the responsive-variant is escaped may depend on its position in
    the class; need to allow for responsive-variant to come at start OR in middle)
  */
  const responsiveVariant = new RegExp(
    `(?<=\\.|\\\\:)(${Array.from(breakpointNames.values())
      .flatMap((e) => e.map(regExpEscape))
      .join('|')})(?=\\\\:)`
  );

  /**
   * @param {string[]} breakpointNameArr
   */
  const makeToContainerQuerySelectors =
    (breakpointNameArr) => /** @param {string[]} selectors */ (selectors) =>
      selectors.flatMap((selector) => {
        const matches = selector.match(responsiveVariant);
        if (!matches) return [];

        const breakpointName = breakpointNameArr.find((e) =>
          matches.includes(e)
        );
        if (!breakpointName) return [];

        const [_main, _pseudoEl] = selector.split('::');
        const main = _main.replace(responsiveVariant, '_$1');
        const pseudoEl = _pseudoEl ? `::${_pseudoEl}` : '';

        return [
          `${main}:is(._${breakpointName} *):not(._${breakpointName} ${containerQueryAncestorSelector} *)${pseudoEl}`,
          `${main}:is(${containerQueryAncestorSelector} ._${breakpointName} *)${pseudoEl}`,
        ];
      });

  return {
    postcssPlugin: 'postcss-tailwindcss-container-query',
    AtRule: {
      media: (rule) => {
        // for now, only doing media-queries at top-level and 1 layer deep; revisit if more depth is needed
        if (rule.parent.type !== 'root') return;

        const breakpointNameArr = breakpointNames.get(rule.params);
        if (!breakpointNameArr) return;

        const toContainerQuerySelectors =
          makeToContainerQuerySelectors(breakpointNameArr);

        rule.each((node) => {
          // handle normal rules
          if (node.type === 'rule' && node.selectors && node.selectors.length) {
            const clone = node.clone();

            clone.selectors = toContainerQuerySelectors(clone.selectors);

            if (clone.selector && clone.selector.trim() !== '') {
              rule.before(clone);
            }
          }

          // allow for an at-rule layer; if more is needed can revisit (something recursive would be ideal)
          else if (node.type === 'atrule') {
            const clone = node.clone();

            clone.each((subnode) => {
              if (
                subnode.type === 'rule' &&
                subnode.selectors &&
                subnode.selectors.length
              ) {
                subnode.selectors = toContainerQuerySelectors(
                  subnode.selectors
                );
                if (!subnode.selector || subnode.selector === '') {
                  subnode.remove();
                }
              } else {
                subnode.remove();
              }
            });

            if (clone.nodes.length) {
              rule.before(clone);
            }
          }
        });
      },
    },
  };
};
module.exports.postcss = true;
