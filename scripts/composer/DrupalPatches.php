<?php

namespace Newcity\composer;

use cweagans\Composer\PatchEvent;

/**
 * Helpful utilities for Drupal patches (applied with cweagans/composer-patches)
 */
class DrupalPatches {

  /**
   * Parse a patch and see if there are newer ones available.
   *
   * @param cweagans\Composer\PatchEvent $event
   *   The event passed from composer-patches.
   */
  public static function checkForNewerPatches(PatchEvent $event) {
    $patch_url = $event->getUrl();
    if (preg_match('/' . preg_quote('https://www.drupal.org/files/issues/', '/') . '.*(\d{7}).*\.patch/', $patch_url, $matches)) {
      $issue_number = $matches[1];

      // Pull the issue node.
      $issue_url = 'https://www.drupal.org/node/' . $issue_number;

      // Fake the browser agent.
      $ch = curl_init($issue_url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
      curl_setopt($ch, CURLOPT_BINARYTRANSFER, TRUE);
      curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)');
      $content = curl_exec($ch);
      curl_close($ch);

      // Parse HTML content.
      $doc = new \DOMDocument();
      @$doc->loadHTML($content);
      $xpath = new \DOMXPath($doc);

      // Get the issue status.
      $status = "";
      $status_nodes = $xpath->query("//div[contains(@class,'field-name-field-issue-status')]/div/div");
      if ($status_nodes && count($status_nodes)) {
        $status = " with status " . $status_nodes[0]->nodeValue;
      }

      // Find files on the issue.
      $anchors = $xpath->query("//td[contains(@class, 'extended-file-field-table-filename')]/span/a");
      $file_urls = [];
      if ($anchors) {
        foreach ($anchors as $link) {
          $file_urls[] = $link->getAttribute('href');
        }
        $issue_patch_urls = array_filter($file_urls, function ($file_url) {
          return self::hasAtEnd($file_url, '.patch');
        });
        if (count($issue_patch_urls) > 0) {
          $possible_patch = trim(array_shift($issue_patch_urls));
          if (!empty($possible_patch) && $possible_patch != $patch_url) {
            echo "A newer patch (" . basename($possible_patch) . ") may be available for issue " . $issue_number . "\n";
            echo "  https://www.drupal.org/node/" . $issue_number . $status . "\n";
          }
        }
      }
    }
  }

  /**
   * Check if a needle is at the end of haystack.
   */
  private static function hasAtEnd($haystack, $needle) {
    $length = strlen($needle);
    if ($length == 0) {
      return TRUE;
    }
    return (substr($haystack, -$length) === $needle);
  }

}
