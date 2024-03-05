<?php

namespace Drupal\odu_custom\Plugin\views\style;

use Drupal\core\form\FormStateInterface;
use Drupal\views\Plugin\views\style\StylePluginBase;

/**
 * Views style plugin.
 *
 * @ingroup views_style_plugins
 *
 * @ViewsStyle(
 *   id = "card_collection",
 *   title = @Translation("Card Collection"),
 *   help = @Translation("A list of items in a card collection."),
 *   theme = "views_view_card_collection",
 *   display_types = { "normal" }
 * )
 */
class CardCollectionStyle extends StylePluginBase {

  /**
   * Whether the display allows the use of a pager or not.
   *
   * @var bool
   */
  protected $usesPager = FALSE;

  /**
   * Whether the display allows area plugins.
   *
   * @var bool
   */
  protected $usesAreas = FALSE;

  /**
   * Does the style plugin support grouping of rows.
   */
  protected $usesGrouping = FALSE;

  /**
   * Does the style plugin for itself support to add fields to it's output.
   */
  protected $usesFields = TRUE;

  /**
   * Specifies if the plugin uses row plugins.
   *
   * @var bool
   */
  protected $usesRowPlugin = TRUE;

  /**
   * {@inheritdoc}
   */
  protected function defineOptions() {
    $options = parent::defineOptions();
    $options['maxCols'] = ['default' => '3'];
    return $options;
  }

  /**
   * {@inheritdoc}
   */
  public function buildOptionsForm(&$form, FormStateInterface $form_state) {
    parent::buildOptionsForm($form, $form_state);

    $form['maxCols'] = [
      '#type' => 'number',
      '#title' => t('Maximum columns'),
      '#default_value' => $this->options['maxCols'] ?? '3',
      '#description' => t('Maximum number of items in a single row.'),
    ];
  }

}
