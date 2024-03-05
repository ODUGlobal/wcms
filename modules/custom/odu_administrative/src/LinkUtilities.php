<?php

namespace Drupal\odu_administrative;

/**
 * Service to provide some global link-related helpers.
 */
class LinkUtilities {

  /**
   * Domains that are OK to follow.
   */
  protected function whitelist() {
    $config = \Drupal::config('odu_administrative.settings');
    $whitelist = $config->get('odu_nofollow_whitelist');
    return explode("\n", $whitelist);
  }

  /**
   * Check if external and not whitelisted.
   */
  public function isExternal(string $url) {
    if (strpos($url, 'http://') === 0 || strpos($url, 'https://') === 0 || strpos($url, '//') === 0) {
      foreach ($this->whitelist() as $test_domain) {
        if (strpos($url, trim($test_domain)) !== FALSE) {
          return FALSE;
        }
      }
      return TRUE;
    }
    return FALSE;
  }

}
