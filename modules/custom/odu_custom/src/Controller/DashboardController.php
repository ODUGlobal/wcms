<?php
namespace Drupal\odu_custom\Controller;

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
      '#theme' => 'admin_block',
      '#block' => [
        'position' => 'left',
        'title' => 'ODU Admin Dashboard',
        'content' => [
          '#theme' => 'admin_block_content',
          '#content' => [],
        ],
        'description' => t('Administrative links for the site.'),
      ],
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
        'title' => $link->getTitle(),
        'weight' => $link->getWeight(),
      ];
    }

    // Sort by weight.
    usort($items, function ($a, $b) {
      return $a['weight'] <=> $b['weight'];
    });

    $build['#block']['content']['#content'] = $items;
    return $build;
  }

}
