<?php

/**
 * Implements hook_preprocess_eck_entity().
 */
function d10starter_preprocess_eck_entity(&$variables) {
  // Set the heading level according to whether the parent paragraph has one.
  $variables['hLevel'] = $variables['elements']['#attributes']['data-use-heading-level'] ?? 2;
}