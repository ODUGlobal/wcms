<?php

namespace Drupal\geofield_zip_proximity;

/**
 * Retrieve coordinates for a zip code.
 */
interface ZipFileReaderInterface {

  /**
   * Given a zip code, return a two-element array representing lat/long.
   */
  public static function lookup($zip);

}
