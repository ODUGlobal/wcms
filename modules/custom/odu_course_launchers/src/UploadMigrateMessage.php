<?php

namespace Drupal\odu_course_launchers;

use Drupal\migrate\MigrateMessage;
use Drupal\Core\Messenger\MessengerInterface;

/**
 * Override the logging migrate messenger to pass messages to the UI.
 */
class UploadMigrateMessage extends MigrateMessage {

  /**
   * Messenger.
   *
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * {@inheritdoc}
   */
  public function __construct(MessengerInterface $messenger) {
    $this->messenger = $messenger;
  }

  /**
   * {@inheritdoc}
   */
  public function display($message, $type = 'status') {
    switch ($type) {
      case 'error':
        $level = MessengerInterface::TYPE_ERROR;
        break;

      default:
        $level = MessengerInterface::TYPE_STATUS;
    }
    $this->messenger->addMessage($message, $level);
  }

}
