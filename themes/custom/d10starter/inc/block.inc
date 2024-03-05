<?php

/**
 * Implements hook_theme_suggestions_HOOK_alter() for form templates.
 */
function d10starter_theme_suggestions_block_alter(array &$suggestions, array $variables) {
  // Block suggestions for custom block bundles.
  if (isset($variables['elements']['content']['#block_content'])) {
    array_splice($suggestions, 1, 0, 'block__block_content__' . $variables['elements']['content']['#block_content']->bundle());
  }
}