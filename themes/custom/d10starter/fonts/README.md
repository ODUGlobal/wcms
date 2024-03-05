# Static Assets - hosted fonts

Path to files: `/themes/custom/THEME_NAME/fonts`

This path will work for accessing files in Drupal and Storybook.

The volume for the Storybook Docker container maps this directory to `/app/static/themes/custom/${THEMENAME}/fonts`. With the Stroybook `static` directory set to `../static` in **docker/bookbinder/.storybook/main.js** the file path will match how they are accessed in the Drupal Docker container.
