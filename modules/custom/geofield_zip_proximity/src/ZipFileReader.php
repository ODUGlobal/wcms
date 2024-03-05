<?php

namespace Drupal\geofield_zip_proximity;

/**
 * Retrieve coordinates for a zip code.
 */
class ZipFileReader implements ZipFileReaderInterface {

  protected static $filename = __DIR__ . '/../data/zips.csv';

  /**
   * {@inheritdoc}
   */
  public static function lookup($zip) {
    // @TODO: make a memory-efficient implementation.
    if (($handle = fopen(self::$filename, "r")) !== FALSE) {
      while (($data = fgetcsv($handle, 32, ",")) !== FALSE) {
        if ($data[0] == $zip) {
          return array_slice($data, 1);
        }
      }
    }

    return FALSE;
  }

}
