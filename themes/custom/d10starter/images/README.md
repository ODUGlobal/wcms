# Static Assets

Path to files: `/themes/custom/THEME_NAME/images`

This path will work for accessing files in Drupal and Storybook.

The volume for the Storybook Docker container maps this directory to `/app/static/themes/custom/${THEMENAME}/images`. With the Stroybook `static` directory set to `../static` in **docker/bookbinder/.storybook/main.js** the file path will match how they are accessed in the Drupal Docker container.