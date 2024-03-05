/*
  This custom PostCSS plugin makes `:matches()` fallback rules for every
  rule that uses `:is()` (mainly to support Safari < 14).
*/

/** @returns {import('postcss').Plugin} */
module.exports = () => {
  return {
    postcssPlugin: 'postcss-matches-fallback-for-is',

    OnceExit(root) {
      root.walkRules((rule) => {
        if (!rule.selector.includes(':is(')) return;

        const clone = rule.clone();
        clone.selectors = clone.selectors.map((selector) =>
          selector.replaceAll(':is(', ':matches(')
        );

        rule.before(clone);
      });
    },
  };
};
module.exports.postcss = true;
