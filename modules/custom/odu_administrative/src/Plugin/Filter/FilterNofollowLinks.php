<?php

namespace Drupal\odu_administrative\Plugin\Filter;

use Drupal\filter\Plugin\FilterBase;
use Drupal\filter\FilterProcessResult;

/**
 * @Filter(
 *   id = "filter_external_nofollow_links",
 *   title = @Translation("Add nofollow attribute to external links (unless whitelisted)"),
 *   type = Drupal\filter\Plugin\FilterInterface::TYPE_TRANSFORM_REVERSIBLE,
 * )
 */
class FilterNofollowLinks extends FilterBase {

  /**
   * {@inheritdoc}
   */
  public function process($text, $langcode) {
    $text = preg_replace_callback('|<a .*?href="(.*?)".*?>|', [$this, 'modifyLink'], $text);
    return new FilterProcessResult($text);
  }

  /**
   * Fix a link to possibly add a nofollow attribute.
   */
  protected function modifyLink($matches) {
    $link = $matches[0];
    $url = $matches[1];
    if (\Drupal::service('odu_administrative.link_utilities')->isExternal($url)) {
      $link = str_replace('>', ' rel="nofollow">', $link);
    }
    return $link;
  }

}
