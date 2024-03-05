<?php

namespace Drupal\odu_custom\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Support Google site search.
 */
class GoogleCustomSearchController extends ControllerBase {

  /**
   * Just set the theme -- everything else is handled in the template.
   */
  public function search() {
    return [
      '#theme' => 'google_custom_search',
      '#cx' => '005785100361997356432:114fw1qhlug',
      '#query_parameter' => 'q',
    ];
  }

}
