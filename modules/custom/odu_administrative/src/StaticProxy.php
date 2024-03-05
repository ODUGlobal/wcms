<?php

namespace Drupal\odu_administrative;

use Drupal\Core\Url;
use Drupal\Core\File\FileSystemInterface;

/**
 * Manage static caching of certain remote assets.
 */
class StaticProxy {

  /**
   * Look up or cache a remote URL.
   */
  public function getLocalUrl($remote_url, $version = NULL) {
    try {
      $prefix = "public://staticproxy/";
      \Drupal::service('file_system')->prepareDirectory($prefix, FileSystemInterface::CREATE_DIRECTORY);
      $path = ($version ? $version . '-' : '') . $this->hashPath($remote_url);
      $uri = $prefix . $path;
      if (!file_exists($uri)) {
        $data = \file_get_contents($remote_url);
        $data = $this->modifyAsset($data);
        \Drupal::service('file_system')->saveData($data, $uri, FileSystemInterface::FILE_EXISTS_REPLACE);
      }
      return Url::fromUri(file_create_url($uri))->toString();
    }
    catch (Exception $e) {
      return $remote_url;
    }
  }

  /**
   * Collapse a URI into a filename.
   */
  protected function hashPath($url) {
    $url = str_replace('://', '-', $url);
    $url = str_replace('/', '-', $url);
    return $url;
  }

  /**
   * Inline edits to the asset.
   */
  protected function modifyAsset($text) {
    return $text;
  }

}
