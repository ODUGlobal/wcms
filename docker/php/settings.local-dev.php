<?php

$config['system.performance']['css']['preprocess'] = FALSE;
$config['system.performance']['js']['preprocess'] = FALSE;

$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/default/newcity.services.yml';

// Settings specifically about caching and debug.
if (!getenv('ENABLE_CACHING')) {
  $settings['cache']['bins']['render'] = 'cache.backend.null';
  $settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';
  $settings['cache']['bins']['page'] = 'cache.backend.null';
}

if (isset($_SERVER['REQUEST_URI']) && $_SERVER['REQUEST_URI'] == '/academics/programs/cyber-risk-management-cert') {
    header('HTTP/1.1 301 Moved Permanently');
    header('Location: https://www.odu.edu/cyber/academics/cyber-risk');
    exit();
}