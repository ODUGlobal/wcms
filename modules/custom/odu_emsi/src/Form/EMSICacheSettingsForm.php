<?php

namespace Drupal\odu_emsi\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * Class EMSICacheSettingsForm.
 *
 * @package Drupal\odu_emsi\Form
 * @ingroup odu_emsi
 */
class EMSICacheSettingsForm extends FormBase {

  /**
   * Returns a unique string identifying the form.
   *
   * @return string
   *   The unique string identifying the form.
   */
  public function getFormId() {
    return 'odu_emsi_settings';
  }

  /**
   * Form submission handler.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   An associative array containing the current state of the form.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Empty implementation of the abstract submit class.
  }

  /**
   * Define the form used for ODU EMSI settings.
   *
   * @return array
   *   Form definition array.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   An associative array containing the current state of the form.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['emsi_cache_settings']['#markup'] = 'Settings form for EMSI Cache. Manage field settings here.';
    $form['import'] = [
      '#type' => 'container',
    ];
    $form['import']['actions'] = [
      '#type' => 'link',
      '#attributes' => [
        'class' => [
          'button',
        ],
      ],
      '#title' => 'Clear Cache',
      '#url' => Url::fromRoute('odu_emsi.import'),
    ];
    return $form;
  }

}
