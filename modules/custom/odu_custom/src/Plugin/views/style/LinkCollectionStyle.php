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
 *   id = "link_collection",
 *   title = @Translation("Link Collection"),
 *   help = @Translation("A group of links, or multiple groups with grouping."),
 *   theme = "views_view_link_collection",
 *   display_types = { "normal" }
 * )
 */
class LinkCollectionStyle extends StylePluginBase {

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
    $options['link_field'] = ['default' => ''];
    $options['grouping_field'] = ['default' => ''];
    return $options;
  }

  /**
   * {@inheritdoc}
   */
  public function buildOptionsForm(&$form, FormStateInterface $form_state) {
    parent::buildOptionsForm($form, $form_state);

    $options = ['' => $this->t('- None -')];
    $field_labels = $this->displayHandler->getFieldLabels(TRUE);
    $options += $field_labels;

    $form['link_field'] = [
      '#type' => 'select',
      '#title' => t('Link field'),
      '#default_value' => $this->options['link_field'],
      '#description' => t('Field to output'),
      '#options' => $options,
    ];

    $form['grouping_field'] = [
      '#type' => 'select',
      '#title' => t('Grouping field'),
      '#default_value' => $this->options['grouping_field'],
      '#options' => $options,
    ];
  }

}
