<?php

namespace Drupal\odu_emsi\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Retrieve location info from config.
 */
class LocationController extends ControllerBase {

  /**
   * Returns MSA geodata based on fuzzy match of location name.
   */
  public function lookup($name) {

    if (is_numeric($name)) {
      return $this->getLocation($name);
    }

    // Fetch array of geodata from local config.
    $map = \Drupal::config('odu_emsi.geodata.config')->get();

    // Filter array based on partial name match.
    $pos = array_map(function ($item) use ($name) {
      if (!is_string($item)) {
        return FALSE;
      }
      return stripos($item, $name);
    }, $map);
    $pos = array_filter($pos, function ($item) {
      return ($item !== FALSE);
    });
    asort($pos);

    $filtered_array = array_map(function ($k) use ($map) {
      return [
        'value' => $k,
        'label' => $map[$k],
      ];
    }, array_keys($pos));

    // Return filtered locations as JSON.
    return new JsonResponse($filtered_array);
  }

  /**
   * Get a location by ID.
   */
  public function getLocation($id) {
    $return = [];
    $build = \Drupal::config('odu_emsi.geodata.config')->get();
    if (isset($build[$id])) {
      $return = [
        'value' => $id,
        'label' => $build[$id],
      ];
    }
    return new JsonResponse($return);
  }

}
