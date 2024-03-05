<?php

namespace Drupal\geofield_zip_proximity\Plugin\GeofieldProximitySource;

use Drupal\Core\Form\FormStateInterface;
use Drupal\geofield\Plugin\GeofieldProximitySourceBase;
use Drupal\geofield_zip_proximity\ZipFileReader;

/**
 * Defines 'Geofield Zip Promximity' plugin.
 *
 * @package Drupal\geofield\Plugin
 *
 * @GeofieldProximitySource(
 *   id = "geofield_zip_proximity",
 *   label = @Translation("Zip code proximity"),
 *   description = @Translation("Use a zip code to look up latitude/longitude from a static list."),
 *   exposedDescription = @Translation("Define an origin with a zip code."),
 *   context = {},
 * )
 */
class ZipProximity extends GeofieldProximitySourceBase {

  protected $zip;

  /**
   * {@inheritdoc}
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->zip = isset($configuration['zip']) ? $configuration['zip'] : '';
    $this->origin = $this->getOriginFromZip($this->zip);
  }

  /**
   * {@inheritdoc}
   */
  public function buildOptionsForm(array &$form, FormStateInterface $form_state, array $options_parents, $is_exposed = FALSE) {
    $form['zip'] = [
      '#title' => t('Zip'),
      '#type' => 'textfield',
      '#description' => t('Zip code'),
      '#default_value' => $this->zip,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function validateOptionsForm(array &$form, FormStateInterface $form_state, array $options_parents) {
    $user_input = $form_state->getUserInput();
    if ($zip = $user_input['options']['source_configuration']['zip']) {
      $this->origin = $this->getOriginFromZip($zip);
    }
  }

  /**
   * Look up coords for a zip code.
   */
  public function getOriginFromZip($zip = NULL) {
    $origin = [];

    if (is_numeric($zip)) {
      if ($coords = ZipFileReader::lookup($zip)) {
        $origin = [
          'lat' => $coords[0],
          'lon' => $coords[1],
        ];
      }
    }

    return $origin;
  }

}
