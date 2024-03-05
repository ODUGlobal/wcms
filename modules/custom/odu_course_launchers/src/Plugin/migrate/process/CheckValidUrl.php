<?php

namespace Drupal\odu_course_launchers\Plugin\migrate\process;

use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;

/**
 * Check if input is a valid URL and skip row otherwise.
 *
 * @MigrateProcessPlugin(
 *   id = "check_valid_url"
 * )
 *
 * Available configuration keys:
 * - url: The URL.
 * - method: What to do if the input value equals to value given in
 *   configuration key value. Possible values:
 *   - row: Skips the entire row.
 *   - process: Prevents further processing of the input property
 */
class CheckValidUrl extends ProcessPluginBase {

  /**
   * {@inheritdoc}
   */
  public function row($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    return $this->testValue($value, '\Drupal\migrate\MigrateSkipRowException');
  }

  /**
   * {@inheritdoc}
   */
  public function process($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    return $this->testValue($value, '\Drupal\migrate\MigrateSkipProcessException');
  }

  /**
   * Process for row or value.
   *
   * Throw an instance of the passed exception for test failure.
   */
  protected function testValue($value, $exception) {

    if (
        (filter_var($value, FILTER_VALIDATE_URL) === FALSE)
        || (strpos($value, 'http') !== 0)
    ) {
      throw new $exception();
    }

    return $value;
  }

}
