<?php

$primary_domain = $_SERVER['HTTP_HOST'];

if (isset($_ENV['PANTHEON_ENVIRONMENT']) && php_sapi_name() != 'cli') {
  // @TODO: set primary domain at launch for live env.
  // Redirect to https://$primary_domain in the Live environment.
  if ($_ENV['PANTHEON_ENVIRONMENT'] === 'live') {
    $primary_domain = 'online.odu.edu';
    // Disable SFP.
    $config['stage_file_proxy.settings']['disabled'] = 1;
  }

  if ($_SERVER['HTTP_HOST'] != $primary_domain
      || !isset($_SERVER['HTTP_USER_AGENT_HTTPS'])
      || $_SERVER['HTTP_USER_AGENT_HTTPS'] != 'ON') {

    // Name transaction "redirect" in New Relic for improved
    // reporting (optional).
    if (extension_loaded('newrelic')) {
      newrelic_name_transaction("redirect");
    }

    header('HTTP/1.0 301 Moved Permanently');
    header('Location: https://' . $primary_domain . $_SERVER['REQUEST_URI']);
    exit();
  }

  if (isset($_SERVER['REQUEST_URI']) && $_SERVER['REQUEST_URI'] == '/academics/programs/cyber-risk-management-cert') {
    header('HTTP/1.1 301 Moved Permanently');
    header('Location: https://www.odu.edu/cyber/academics/cyber-risk');
    exit();
  }
}

if (defined(
  'PANTHEON_ENVIRONMENT'
 ) && !\Drupal\Core\Installer\InstallerKernel::installationAttempted(
 ) && extension_loaded('redis')) {
  // Set Redis as the default backend for any cache bin not otherwise specified.
  $settings['cache']['default'] = 'cache.backend.redis';
 
  //phpredis is built into the Pantheon application container.
  $settings['redis.connection']['interface'] = 'PhpRedis';
 
  // These are dynamic variables handled by Pantheon.
  $settings['redis.connection']['host'] = $_ENV['CACHE_HOST'];
  $settings['redis.connection']['port'] = $_ENV['CACHE_PORT'];
  $settings['redis.connection']['password'] = $_ENV['CACHE_PASSWORD'];
 
  $settings['redis_compress_length'] = 100;
  $settings['redis_compress_level'] = 1;
 
  $settings['cache_prefix']['default'] = 'pantheon-redis';
 
  $settings['cache']['bins']['form'] = 'cache.backend.database'; // Use the database for forms
 
  // Apply changes to the container configuration to make better use of Redis.
  // This includes using Redis for the lock and flood control systems, as well
  // as the cache tag checksum. Alternatively, copy the contents of that file
  // to your project-specific services.yml file, modify as appropriate, and
  // remove this line.
  $settings['container_yamls'][] = 'modules/contrib/redis/example.services.yml';
 
  // Allow the services to work before the Redis module itself is enabled.
  $settings['container_yamls'][] = 'modules/contrib/redis/redis.services.yml';
 
  // Manually add the classloader path, this is required for the container
  // cache bin definition below.
  $class_loader->addPsr4('Drupal\\redis\\', 'modules/contrib/redis/src'); 
 
  // Use redis for container cache.
  // The container cache is used to load the container definition itself, and
  // thus any configuration stored in the container itself is not available
  // yet. These lines force the container cache to use Redis rather than the
  // default SQL cache.
  $settings['bootstrap_container_definition'] = [
    'parameters' => [],
    'services' => [
      'redis.factory' => [
        'class' => 'Drupal\redis\ClientFactory',
      ],
      'cache.backend.redis' => [
        'class' => 'Drupal\redis\Cache\CacheBackendFactory',
        'arguments' => [
          '@redis.factory',
          '@cache_tags_provider.container',
          '@serialization.phpserialize',
        ],
      ],
      'cache.container' => [
        'class' => '\Drupal\redis\Cache\PhpRedis',
        'factory' => ['@cache.backend.redis', 'get'],
        'arguments' => ['container'],
      ],
      'cache_tags_provider.container' => [
        'class' => 'Drupal\redis\Cache\RedisCacheTagsChecksum',
        'arguments' => ['@redis.factory'],
      ],
      'serialization.phpserialize' => [
        'class' => 'Drupal\Component\Serialization\PhpSerialize',
      ],
    ],
  ];
 }

/**
 * Load services definition file.
 */
$settings['container_yamls'][] = __DIR__ . '/services.yml';

/**
 * Include the Pantheon-specific settings file.
 *
 * n.b. The settings.pantheon.php file makes some changes
 *      that affect all envrionments that this site
 *      exists in.  Always include this file, even in
 *      a local development environment, to insure that
 *      the site settings remain consistent.
 */
include __DIR__ . "/settings.pantheon.php";

// Drupal 8 Trusted Host Settings.
$settings['trusted_host_patterns'] = ['^' . preg_quote($primary_domain) . '$'];

// Configure Redis
// if (defined('PANTHEON_ENVIRONMENT')) {
//   // Include the Redis services.yml file. Adjust the path if you installed to a contrib or other subdirectory.
//   $settings['container_yamls'][] = 'modules/contrib/redis/example.services.yml';

//   //phpredis is built into the Pantheon application container.
//   $settings['redis.connection']['interface'] = 'PhpRedis';
//   // These are dynamic variables handled by Pantheon.
//   $settings['redis.connection']['host']      = $_ENV['CACHE_HOST'];
//   $settings['redis.connection']['port']      = $_ENV['CACHE_PORT'];
//   $settings['redis.connection']['password']  = $_ENV['CACHE_PASSWORD'];

//   $settings['cache']['default'] = 'cache.backend.redis'; // Use Redis as the default cache.
//   $settings['cache_prefix']['default'] = 'pantheon-redis';

//   // Set Redis to not get the cache_form (no performance difference).
//   $settings['cache']['bins']['form']      = 'cache.backend.database';
// }

/**
 * Fast 404 pages:
 *
 * Drupal can generate fully themed 404 pages. However, some of these responses
 * are for images or other resource files that are not displayed to the user.
 * This can waste bandwidth, and also generate server load.
 *
 * The options below return a simple, fast 404 page for URLs matching a
 * specific pattern:
 * - $config['system.performance']['fast_404']['exclude_paths']: A regular
 *   expression to match paths to exclude, such as images generated by image
 *   styles, or dynamically-resized images. The default pattern provided below
 *   also excludes the private file system. If you need to add more paths, you
 *   can add '|path' to the expression.
 * - $config['system.performance']['fast_404']['paths']: A regular expression to
 *   match paths that should return a simple 404 page, rather than the fully
 *   themed 404 page. If you don't have any aliases ending in htm or html you
 *   can add '|s?html?' to the expression.
 * - $config['system.performance']['fast_404']['html']: The html to return for
 *   simple 404 pages.
 *
 * Remove the leading hash signs if you would like to alter this functionality.
 */
$config['system.performance']['fast_404']['exclude_paths'] = '/\/(?:styles)|(?:system\/files)\//';
$config['system.performance']['fast_404']['paths'] = '/\.(?:txt|png|gif|jpe?g|css|js|ico|swf|flv|cgi|bat|pl|dll|exe|asp|s?html?|xml)$/i';
$config['system.performance']['fast_404']['html'] = '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>Not Found</h1><p>The requested URL was not found on this server.</p></body></html>';

/**
 * If there is a local settings file, then include it.
 */
$local_settings = __DIR__ . "/settings.local.php";
if (file_exists($local_settings)) {
  include $local_settings;
}
