<?php

namespace Drupal\odu_course_launchers\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\migrate\Event\MigrateEvents;
use Drupal\migrate\Event\MigrateImportEvent;
use Drupal\migrate\Event\MigratePostRowSaveEvent;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Watch for import events.
 */
class ImportSubscriber implements EventSubscriberInterface {

  use StringTranslationTrait;

  /**
   * Term ID for current semester.
   *
   * @var int
   */
  protected $semester;

  /**
   * List of URLs in current import.
   *
   * @var array
   */
  protected $urls;

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[MigrateEvents::PRE_IMPORT][] = ['onPreImport'];
    $events[MigrateEvents::POST_IMPORT][] = ['onPostImport'];
    $events[MigrateEvents::POST_ROW_SAVE][] = ['onPostRowSave'];
    return $events;
  }

  /**
   * Pre-import subscription.
   */
  public function onPreImport(MigrateImportEvent $event) {
    if ($event->getMigration()->getPluginId() == 'courses') {
      // Reset.
      $this->semester = '';
      $this->urls = [];
    }
  }

  /**
   * Post-row subscription.
   */
  public function onPostRowSave(MigratePostRowSaveEvent $event) {
    if ($event->getMigration()->getPluginId() == 'courses') {
      // Store the semester and URL.
      $links = \Drupal::service('entity_type.manager')->getStorage('external_link')->loadMultiple($event->getDestinationIdValues());
      foreach ($links as $link) {
        $this->semester = $link->field_semester->target_id;
        $this->urls[] = $link->field_link->uri;
      }
    }
  }

  /**
   * Post-import subscription.
   */
  public function onPostImport(MigrateImportEvent $event) {
    $migration = $event->getMigration();
    if ($migration->getPluginId() == 'courses') {
      // Find courses of this semester that weren't just imported.
      $external_link_storage = \Drupal::service('entity_type.manager')->getStorage('external_link');
      $ids = $external_link_storage
        ->getQuery()
        ->accessCheck(FALSE)
        ->condition('field_semester.target_id', $this->semester)
        ->condition('field_link.uri', $this->urls, 'NOT IN')
        ->execute();
      if ($ids) {
        $to_delete = $external_link_storage->loadMultiple($ids);

        if ($migration->delete_missing_courses) {
          // Delete entities that weren't just imported.
          $deleted_urls = array_map(function ($entity) {
            $url = $entity->field_link->uri;
            $entity->delete();
            return $url;
          }, $to_delete);
          $messenger = \Drupal::service('messenger');
          $messenger->addMessage(
            $this->t('Deleted semester courses not in current import: %urls', ['%urls' => implode(', ', $deleted_urls)]),
            $messenger::TYPE_STATUS
          );
        }
        else {
          $vanished_urls = array_map(function ($entity) {
            $url = $entity->field_link->uri;
            return $url;
          }, $to_delete);
          $messenger = \Drupal::service('messenger');
          $messenger->addMessage(
            $this->t('Some existing semester courses were not in this import: %urls. To remove them, rerun the import with "Remove existing course" checked.', ['%urls' => implode(', ', $vanished_urls)]),
            $messenger::TYPE_WARNING
          );
        }
      }
    }
  }

}
