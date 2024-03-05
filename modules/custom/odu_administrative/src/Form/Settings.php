<?php

namespace Drupal\odu_administrative\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Settings form for module.
 */
class Settings extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'odu_administrative_settings_form';
  }

  /**
   * Gets the configuration names that will be editable.
   *
   * @return array
   *   An array of configuration object names that are editable if called in
   *   conjunction with the trait's config() method.
   */
  protected function getEditableConfigNames() {
    return ['odu_administrative.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('odu_administrative.settings');

    $form['use_formassembly_static_caching'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable FormAssembly embed static asset proxy'),
      '#default_value' => $config->get('use_formassembly_static_caching') ?? FALSE,
    ];

    $form['odu_nofollow_whitelist'] = [
      '#type' => 'textarea',
      '#title' => $this->t('List of domains or URL partials that will NOT have nofollow attribute applied to links.'),
      '#default_value' => $config->get('odu_nofollow_whitelist') ?? '',
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config_values = $form_state->getValues();
    $config_fields = [
      'use_formassembly_static_caching',
      'odu_nofollow_whitelist',
    ];
    $config = $this->config('odu_administrative.settings');
    foreach ($config_fields as $config_field) {
      $config->set($config_field, $config_values[$config_field]);
    }
    $config->save();
    parent::submitForm($form, $form_state);
  }

}
