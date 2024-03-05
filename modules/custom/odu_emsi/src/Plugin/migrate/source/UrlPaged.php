<?php

namespace Drupal\odu_emsi\Plugin\migrate\source;

use Drupal\migrate_plus\Plugin\migrate\source\Url;
use Drupal\migrate\MigrateException;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\Core\Cache\CacheBackendInterface;

/**
 * Source plugin for retrieving data via URLs, with paging support.
 *
 * @MigrateSource(
 *   id = "url_paged"
 * )
 */
class UrlPaged extends Url {

  /**
   * URL cache identifier.
   *
   * @var string
   */
  protected $cache_key;

  /**
   * The minimum allowed length (in chars) of a HTTP response.
   *
   * @var int
   */
  protected $minResponseLength = 100;

  /**
   * Guzzle headers.
   *
   * @var array
   */
  protected $headers;

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, MigrationInterface $migration) {
    if (!isset($configuration['url_pattern'])) {
      throw new MigrateException('url_pattern is required to set the base URL pattern.');
    }
    if (!isset($configuration['offset_key'])) {
      throw new MigrateException('offset_key is required to define the offset template in the URL pattern.');
    }
    if (!isset($configuration['offset_increment'])) {
      throw new MigrateException('offset_increment is required to set the offset each iteration.');
    }

    if (strpos($configuration['url_pattern'], $configuration['offset_key']) === FALSE) {
      throw new MigrateException('offset_key not found in base URL pattern.');
    }

    $configuration['urls'] = [];
    parent::__construct($configuration, $plugin_id, $plugin_definition, $migration);

    $this->cache_key = 'url_paged_' . \urlencode($configuration['url_pattern']) . '_' . \urlencode($configuration['offset_key']);

    $this->headers = $configuration['headers'] ?? [];

    if ($cache = \Drupal::cache()->get($this->cache_key)) {
      $configuration['urls'] = $cache->data;
    }
    else {
      $configuration['urls'] = $this->generateUrls($configuration['url_pattern'], $configuration['offset_key'], $configuration['offset_increment']);
    }
    parent::__construct($configuration, $plugin_id, $plugin_definition, $migration);

    $this->sourceUrls = $configuration['urls'];
  }

  /**
   * Generate a set of URLs based on a paging pattern.
   */
  protected function generateUrls($base_url, $key, $inc) {
    $urls = [];
    $offset = 0;
    while ($url = $this->checkUrl($base_url, $key, $offset)) {
      $urls[] = $url;
      $offset += $inc;
    }
    \Drupal::cache()->set($this->cache_key, $urls, CacheBackendInterface::CACHE_PERMANENT);
    return $urls;
  }

  /**
   * Build and check a URL for non-emptyness.
   */
  protected function checkUrl($base_url, $key, $offset) {
    $url = str_replace($key, $offset, $base_url);
    \Drupal::logger('odu_emsi')->notice("checking " . $url);
    $response = $this->getDataParserPlugin()->getDataFetcherPlugin()->getResponse($url);
    $body = (string) $response->getBody();
    return (strlen($body) >= $this->minResponseLength) ? $url : FALSE;
  }

}
