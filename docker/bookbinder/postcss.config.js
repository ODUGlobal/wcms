module.exports = () => ({
  plugins: [
    require('postcss-import-ext-glob'),
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('postcss-focus-visible'),
    require('autoprefixer'),
    require('/app/postcss-custom-plugins/postcss-tailwindcss-typography-embeds')(
      {
        wysiwygEmbedSelector: '.wysiwyg-embed',
      }
    ),
    require('/app/postcss-custom-plugins/postcss-tailwindcss-container-query')({
      containerQueryAncestorSelector: '[data-container-query-ancestor]',
    }),
    require('postcss-inset'),
    require('/app/postcss-custom-plugins/postcss-matches-fallback-for-is')(),
    ...(process.env.NODE_ENV === 'production' ? [require('cssnano')] : []),
  ],
});
