<?php

namespace Drupal\odu_course_launchers\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\migrate\Plugin\MigrationInterface;

/**
 * Course launcher helpers.
 */
class MigrateHelperController extends ControllerBase {

  /**
   * Clear out migrate table for deleted items.
   */
  public function clearOrphans() {

    // Get all the courses.
    $ids = \Drupal::entityQuery('external_link')
      ->accessCheck(TRUE)
      ->condition('type', 'course')
      ->execute();

    // Deleted mapped migration items NOT in the ids list.
    $db = \Drupal::database();
    $maps = $db->delete('migrate_map_courses')
      ->condition('destid1', $ids, 'NOT IN')
      ->execute();

    $messenger = \Drupal::messenger();
    $messenger->addMessage(
      $this->t('Cleared %orphan_count orphaned migration records', ['%orphan_count' => $maps]),
      $messenger::TYPE_STATUS);

    return $this->redirect('odu_course_launchers.upload');
  }

  /**
   * Reset migration.
   */
  public function resetMigration() {
    $messenger = \Drupal::messenger();

    // Pulled from migrate_tools: https://git.drupalcode.org/project/migrate_tools/blob/8.x-4.x/src/Commands/MigrateToolsCommands.php#L489
    $migration = \Drupal::service('plugin.manager.migration')->createInstance('courses');
    $status = $migration->getStatus();
    if ($status == MigrationInterface::STATUS_IDLE) {
      $messenger->addMessage(
        $this->t('Migration already idle.'),
        $messenger::TYPE_STATUS);
    }
    else {
      $migration->setStatus(MigrationInterface::STATUS_IDLE);
      $messenger->addMessage(
        $this->t('Migration reset to idle.'),
        $messenger::TYPE_STATUS);
    }

    return $this->redirect('odu_course_launchers.upload');
  }

}
