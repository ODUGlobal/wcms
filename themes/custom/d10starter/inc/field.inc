<?php

/**
 * Implements hook_preprocess_field().
 */
function d10starter_preprocess_field(&$variables) {
  // Mark media fields with their types.
  if ($variables['field_name'] == 'field_media') {
    $types = [];
    foreach ($variables['items'] as $item) {
      if (!isset($item['content']['#media'])) {
        continue;
      }
      if ($media = $item['content']['#media']) {
        $types[] = $media->bundle();
      }
    }
    if (!isset($variables['attributes']['class'])) {
      $variables['attributes']['class'] = [];
    }
    $variables['attributes']['class'] += array_unique($types);
  }

  // Modify Youtube Oembed markup.
  if ($variables['field_name'] == 'field_media_oembed_video') {
    $media = $variables['element']['#object'];
    $variables['attributes']['class'][] = 'responsive-embed';
    $query_params = [
      'modestbranding' => 1,
      'showinfo' => 0,
      'rel' => 0,
    ];
    foreach ($variables['items'] as $i => $item) {
      $embed = $item['content']['#context']['media'];
      if ($embed && (strpos($embed, 'title=') === FALSE)) {
        $embed = str_replace('<iframe', '<iframe title="Embedded video"', $embed);
      }
      $embed = str_replace('?feature=oembed', '?' . http_build_query($query_params), $embed);
      $variables['items'][$i]['content']['#context']['media'] = $embed;
    }
  }
}

