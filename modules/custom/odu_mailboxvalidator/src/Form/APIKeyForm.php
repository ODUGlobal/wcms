<?php

namespace Drupal\odu_mailboxvalidator\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;


/**
 * Manage the CSV file.
 */
class APIKeyForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'odu_mailboxvalidator_api_form';
  }

  /** 
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'odu_mailboxvalidator.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $config = $this->config('odu_mailboxvalidator.settings');
    $form = [];

    $form['api_key'] = [
      '#type' => 'textfield',
      '#title' => $this->t('API Key'),
      '#description' => $this->t('MailboxValidator Service API Key'),
      '#default_value' => $config->get('api_key'),
    ];

    $form['whitelist'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Whitelist'),
      '#description' => $this->t('Domains to whitelist, one per line.  If an email ends with this, it will pass no matter what. Examples: <em>.mil</em> or <em>example.com</em>.'),
      '#default_value' => $config->get('whitelist'),
    ];

    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save'),
      '#button_type' => 'primary',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    if ($form_state->getValue('api_key') == NULL) {
      $form_state->setErrorByName('api_key', $this->t('Need an API Key.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    // Retrieve the configuration
    $this->configFactory->getEditable('odu_mailboxvalidator.settings')
    ->set('api_key', $form_state->getValue('api_key'))
    ->set('whitelist', $form_state->getValue('whitelist'))
    ->save();

    $messenger = \Drupal::messenger();
    $messenger->addMessage($this->t('Data saved'), $messenger::TYPE_STATUS);
  }


}