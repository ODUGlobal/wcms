<?php

namespace Drupal\odu_emsi\Form;

use Drupal\Core\Entity\ContentEntityConfirmFormBase;

/**
 * Provides a form for deleting a odu_emsi entity.
 *
 * @ingroup odu_emsi
 */
class EMSICacheDeleteForm extends ContentEntityConfirmFormBase {

  /**
   * Returns the question to ask the user.
   *
   * @return string
   *   The form question. The page title will be set to this value.
   */
  public function getQuestion() {
    // TODO: Implement getQuestion() method.
  }

  /**
   * Returns the route to go to if the user cancels the action.
   *
   * @return \Drupal\Core\Url
   *   A URL object.
   */
  public function getCancelUrl() {
    // TODO: Implement getCancelUrl() method.
  }

}
