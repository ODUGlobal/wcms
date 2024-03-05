<?php

use Drupal\redirect\Entity\Redirect;

$redirects = json_decode(file_get_contents(__DIR__ . '/../redirects.json'));

foreach ($redirects as $redirect) {
  $r = Redirect::create([
    'redirect_source' => [
      'path' => $redirect->source,
      'query' => $redirect->query,
    ],
    'redirect_redirect' => [
      'uri' => $redirect->target,
    ],
    'status_code' => '301',
  ]);
  $r->save();
}