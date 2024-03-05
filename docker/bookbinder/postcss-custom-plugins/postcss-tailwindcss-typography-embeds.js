/* 
  This custom PostCSS plugin transforms Tailwind Typography's
  `.prose [[something]]` / `.prose-lg [[something]]` (etc.) selectors
  (as well as their responsive variants, like `.lg:prose-lg [[something]]`)
  into fancier ones that "skip over" `.wysiwyg-embed` sections, allowing
  in-template utility-classes in those `.wysiwyg-embed` sections to
  apply where otherwise a conflicting Typography rule would prevail due to
  higher specificty.

  In brief, it turns selectors like `.prose p` into selectors like:

  .prose p:not(.wysiwyg-embed *),
  .wysiwyg-embed .prose p:not(.wysiwyg-embed .wysiwyg-embed *),
  .wysiwyg-embed .wysiwyg-embed .prose p

  (allows for a few "layers", so that the first `.wysiwyg-embed` can itself have
  a `.prose` section, which in turn can have a `.wysiwyg-embed`, which in turn
  can have a `.prose` -- that's it, but SURELY should be enough)

  Because of how these selectors work, it's crucial to avoid superfluous `.prose`
  and `.wysiwyg-embed` classes in the markup.

  "Global"/top-level `.prose` rules (on `.prose` itself) that are inheritable properties
  (like color and font-size) need to be manually "undone" on `.wysiwyg-embed` (outside
  the scope of this plugin)
*/

const fs = require('fs');
const {
  default: escapeClassName,
} = require('tailwindcss/lib/util/escapeClassName');

const regExpEscape = (str) => str.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');

/** @returns {import('postcss').Plugin} */
module.exports = ({ wysiwygEmbedSelector = '.wysiwyg-embed' }) => {
  const tailwindConfig = JSON.parse(
    fs.readFileSync('/app/full-tailwind-config.json')
  );

  const minWidthBreakpointNames = Object.entries(tailwindConfig.theme.screens)
    .filter(([, value]) => typeof value === 'string' || value.min)
    .map(([key]) => escapeClassName(key));

  // e.g., for default TW breakpoints: /^\.(?:(?:sm|md|lg|xl|\\32xl)\\:)?prose(?:-\S+)? .+/
  const proseRegExp = new RegExp(
    `^\\.(?:(?:${minWidthBreakpointNames
      .map(regExpEscape)
      .join('|')})\\\\:)?prose(?:-\\S+)? .+`
  );

  return {
    postcssPlugin: 'postcss-tailwindcss-typography-embeds',

    // I *think* `Once` instead of `Root` is appropriate here (difference is that `Root` will re-run if there are changes)
    Once(root) {
      root.walkRules((rule) => {
        if (!proseRegExp.test(rule.selector)) return;

        rule.selectors = rule.selectors.flatMap((selector) => {
          if (!proseRegExp.test(selector)) return [selector];

          const [main, _pseudoEl] = selector.split('::');
          const pseudoEl = _pseudoEl ? `::${_pseudoEl}` : '';

          return [
            `${main}:not(${wysiwygEmbedSelector} *)${pseudoEl}`,
            `${wysiwygEmbedSelector} ${main}:not(${wysiwygEmbedSelector} ${wysiwygEmbedSelector} *)${pseudoEl}`,
            `${wysiwygEmbedSelector} ${wysiwygEmbedSelector} ${selector}`,
          ];
        });
      });
    },
  };
};
module.exports.postcss = true;
