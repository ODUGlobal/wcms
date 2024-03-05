<?php

/**
 * Implements hook_preprocess_node().
 */
function d10starter_preprocess_node(&$variables) {
  if ($variables['view_mode'] == 'teaser') {
    // See paragraph.inc.
    // Set the heading level according to whether the parent paragraph has one.
    $variables['hLevel'] = $variables['elements']['#attributes']['data-use-heading-level'] ?? 2;
  }

  $node = $variables['node'];
  if($node->bundle() == 'inquiry' && $variables['view_mode'] == 'full') {
    \Drupal::service('odu_custom.theme')->addRegionsToBuild(['form_embed'], $variables);
  }

  if (isset($variables['content']['field_display_title']) && count($node->field_display_title)) {
    $variables['display_title'] = $variables['content']['field_display_title'][0];
  }
  else {
    $variables['display_title'] = $node->getTitle();
  }
}
