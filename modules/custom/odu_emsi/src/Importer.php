<?php

namespace Drupal\odu_emsi;

use Drupal\migrate_tools\MigrateExecutable;
use Drupal\migrate\MigrateMessage;
use Drupal\migrate\Plugin\MigrationInterface;

class Importer {

  /**
   * Run a cache import.
   */
  public function import() {
    // Run EMSI program import.
    $migration = \Drupal::service('plugin.manager.migration')->createInstance('emsi');
    $migration->getIdMap()->prepareUpdate();

    if ($migration->getStatus() !== MigrationInterface::STATUS_IDLE) {
      $migration->setStatus(MigrationInterface::STATUS_IDLE);
    }
    $executable = new MigrateExecutable($migration, new MigrateMessage());
    $executable->import();

    // Log that the migration has run.
    \Drupal::logger('emsi_import')->notice('EMSI import has run');
    if (\Drupal::state()->get('emsi_import_show_status_message')) {
      \Drupal::messenger()->addMessage(t('EMSI program import executed at %time', ['%time' => date('c', $_SERVER['REQUEST_TIME'])]));
      \Drupal::state()->set('emsi_import_show_status_message', FALSE);
    }
  }

}
