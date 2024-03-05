<?php

namespace Drupal\odu_emsi\Plugin\migrate\process;

use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Row;

/**
 * This plugin serializes data.
 *
 * @link https://www.drupal.org/node/2771965 Online handbook documentation for substr process plugin @endlink
 *
 * @MigrateProcessPlugin(
 *   id = "serializer"
 * )
 */
class Serializer extends ProcessPluginBase {

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    return serialize($value);
  }

}
