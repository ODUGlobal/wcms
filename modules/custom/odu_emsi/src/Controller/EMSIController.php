<?php

namespace Drupal\odu_emsi\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\odu_emsi\EMSIAPI;

/**
 * Main controller for EMSI widget.
 */
class EMSIController extends ControllerBase {

  /**
   * The API.
   *
   * @var \Drupal\odu_emsi\EMSIAPI
   */
  private $EMSI;

  /**
   * {@inheritdoc}
   */
  public function __construct() {
    // TODO: create a service and inject.
    $this->EMSI = new EMSIAPI();
  }

  /**
   * Cache career data.
   */
  private function getEmsiData($entity_id, $region_id) {
    $entity_storage = \Drupal::entityTypeManager()->getStorage('odu_emsi_emsi_cache');
    $entity = $entity_storage->load($entity_id);
    $career_data = unserialize($entity->get('career_data')->value);

    // For each EMSI career ID, get regional data figures from EMSI API.
    $career_array = [];
    foreach ($career_data as $career) {
      array_push($career_array, $this->EMSI->getCareerData($career, $region_id));
    }
    return $career_array;
  }

  /**
   * Get career data by unique ID.
   *
   * Given a career_id (original EE ID stored for program at EMSI)
   * and a region ID (MSA value from geodata config),
   * query EMSI service to fetch actual career data for specific region
   * cache values with Cache API as per caching settings in site.
   */
  private function getCareerDataById($career_id, $region_id) {
    // Get list of EMSI career IDs from local EMSI entity cache, for specific program
    $entity_ids = \Drupal::entityQuery('odu_emsi_emsi_cache')
      ->accessCheck(FALSE)
      ->condition('program_id', $career_id)
      ->execute();
    if (!$entity_ids) {
      \Drupal::logger('odu_emsi')->error("Career ID $career_id not found in cache.");
      return [];
    }
    $entity_id = reset($entity_ids);
    $career_array = $this->getEmsiData($entity_id, $region_id);

    return $career_array;
  }

  /**
   * Return career data for a given program node.
   */
  public function getCareerDataByProgram($node_id, $region_id) {
    // Generate cache ID.
    $cid = '$emsi_program_cache_' . $node_id . '_' . $region_id;

    // Check Drupal cache for this ID.
    if ($cache = \Drupal::cache()->get($cid)) {
      $career_array = $cache->data;

      // If not cached, query EMSI service for career data.
    }
    else {
      $career_array = [];
      $node = \Drupal::entityTypeManager()->getStorage('node')->load($node_id);
      if ($node) {
        if ($node->field_emsi_key) {
          $emsi_key = $node->field_emsi_key->value;
          $career_array = $this->getCareerDataById($emsi_key, $region_id);
        }
      }
      \Drupal::cache()->set($cid, $career_array);
    }

    // Return career data as JSON.
    return new JsonResponse($career_array);
  }

  /**
   * Endpoint to manually run an import.
   */
  public function import() {
    \Drupal::service('odu_emsi.importer')->import();
    return $this->redirect('odu_emsi.emsi_cache_settings');
  }

}
