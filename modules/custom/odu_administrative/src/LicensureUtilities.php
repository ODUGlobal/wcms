<?php

namespace Drupal\odu_administrative;

use Drupal\node\NodeInterface;
use Drupal\Core\Cache\CacheBackendInterface;

/**
 * Services for things like counting licensure relationships.
 */
class LicensureUtilities {
  protected $licensure_field = 'field_licensure_information';
  protected $licensure_status_field = 'field_licensing_status';
  protected $licensure_state_field = 'field_state';

  /**
   * Count status by licensure.
   */
  public function runCounts(NodeInterface $node) {
    if (!$node->hasField($this->licensure_field)) {
      return NULL;
    }
    $nid = $node->id();
    $cache = \Drupal::cache()->get('odu_administrative.licensure.' . $nid);
    if (!empty($cache->data)) {
      return $cache->data;
    }
    $licensures = $node->get($this->licensure_field);
    $states = [];
    $counts = [];
    foreach (['yes', 'maybe'] as $status_key) {
      foreach ($licensures as $licensure) {
        $licensure_entity = $licensure->entity;
        if (!$licensure_entity->hasField($this->licensure_status_field) || !$licensure_entity->hasField($this->licensure_state_field)) {
          continue;
        }
        $status = $licensure_entity->get($this->licensure_status_field);
        $state = $licensure_entity->get($this->licensure_state_field);
        if ($status->value == $status_key) {
          $states[$status_key][] = $state->target_id;
        }
      }
      $counts[$status_key] = count(array_unique($states[$status_key] ?? []));
    }
    \Drupal::cache()->set('odu_customizations.licensure.' . $nid, $counts, CacheBackendInterface::CACHE_PERMANENT, ['node:' . $nid ]);
    return $counts;
  }

  public function count(NodeInterface $node, $status) {
    $counts = $this->runCounts($node);
    return $counts[$status] ?? 0;
  }
  
}