<?php

namespace Drupal\odu_administrative\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Returns responses for Dashboard routes.
 */
class DashboardController extends ControllerBase {

  /**
   * Main listing.
   */
  public function view() {
    $build = [
      '#theme' => 'odu_admin_listing',
    ];
    $items = [];

    // Grab items out of the menu.
    $menu_tree = \Drupal::menuTree();
    $menu_name = 'dashboard';

    // Build the typical default set of menu tree parameters.
    $parameters = $menu_tree->getCurrentRouteMenuTreeParameters($menu_name);
    $tree = $menu_tree->load($menu_name, $parameters);

    foreach ($tree as $tree_element) {
      $link = $tree_element->link;
      $items[] = [
        'url' => $link->getUrlObject(),
        'label' => $link->getTitle(),
        'description' => $link->getDescription(),
        'weight' => $link->getWeight(),
      ];
    }

    // Sort by weight.
    usort($items, function ($a, $b) {
      return $a['weight'] <=> $b['weight'];
    });

    $build['#items'] = $items;
    return $build;
  }

}
