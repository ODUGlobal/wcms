<?php

namespace Drupal\odu_custom;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Theme\ThemeManagerInterface;

/**
 * Theme utility functions.
 */
class Theme {
  /**
   * Theme manager service.
   *
   * @var \Drupal\Core\Theme\ThemeManagerInterface
   */
  protected $themeManager;

  /**
   * Type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * {@inheritdoc}
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, ThemeManagerInterface $theme_manager) {
    $this->entityTypeManager = $entity_type_manager;
    $this->themeManager = $theme_manager;
  }

  /**
   * Inject page regions into build array.
   */
  public function addRegionsToBuild(array $regions, array &$variables) {
    $theme = $this->themeManager->getActiveTheme()->getName();

    // Retrieve theme regions.
    $available_regions = system_region_list($theme, 'REGIONS_ALL');

    // Validate allowed regions with available regions.
    $regions = array_intersect(array_keys($available_regions), $regions);

    foreach ($regions as $region) {
      // Load region blocks.
      $blocks = $this->entityTypeManager
        ->getStorage('block')
        ->loadByProperties(['theme' => $theme, 'region' => $region]);
      // Sort ‘em.
      uasort($blocks, 'Drupal\block\Entity\Block::sort');

      // Capture viewable blocks and their settings to $build.
      $blockStorage = $this->entityTypeManager->getStorage('block');
      $build = [];
      foreach ($blocks as $key => $block) {
        if ($block->access('view')) {
          $block = $blockStorage->load($key);
          $block_content = $this->entityTypeManager
            ->getViewBuilder('block')
            ->view($block);
          $build[$key] = $block_content;
        }
      }

      $variables['regions'][$region] = $build;
    }
  }
}
