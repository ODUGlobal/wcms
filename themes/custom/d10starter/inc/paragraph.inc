<?php
use Drupal\Core\Cache\Cache;
use Drupal\Core\Render\Element;

/**
 * Implements hook_preprocess_paragraph().
 */
function d10starter_preprocess_paragraph(&$variables) {
    // If heading exists on the paragraph, let the collection items know
    // so they may adjust their own heading levels.
    // See also eck.inc and node.inc.
    $paragraph = $variables['paragraph'];
    $child_entity_fields = ['field_collection_items', 'field_content_reference'];
    foreach ($child_entity_fields as $child_field) {
        if ($paragraph->hasField('field_heading') && $paragraph->hasField($child_field)) {
            if (count($paragraph->{$child_field})) {
                foreach (Element::children($variables['content'][$child_field]) as $delta) {
                    if (count($paragraph->field_heading)) {
                        $variables['content'][$child_field][$delta]['#attributes']['data-use-heading-level'] = 3;
                    }
                    // Child cache now has a dependency on this paragraph.
                    $variables['content'][$child_field][$delta]['#cache']['tags'] = Cache::mergeTags(
                        $variables['content'][$child_field][$delta]['#cache']['tags'] ?? [],
                        $paragraph->getCacheTags(),
                    );
                }
            }
        }
    }
}

function d10starter_preprocess_paragraph__program_routing(&$variables) {
    $cache_tags = [];

    $storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');
    $query = $storage->getQuery();
    $query->condition('vid', 'degree_level');
    $query->condition('field_hide_from_listings', 0);
    $query->sort('weight', 'ASC');
    $query->sort('name', 'ASC');
    $query->range(0, 4);
    $query->accessCheck(false);
    $tids = $query->execute();
    $terms = $storage->loadMultiple($tids);

    if(!empty($terms)) {
        $variables['buttonLinks'] = [];

        foreach($terms as $term) {
            $terms_to_be_cached[] = $term->id();
            
            $variables['buttonLinks'][] = [
                'link' => [
                    'title' => $term->getName(),
                    'url' => $term->toUrl()->toString(),
                ]
            ];

            $cache_tags = Cache::mergeTags($cache_tags, $term->getCacheTags());
        }
    }

    $storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');
    $query = $storage->getQuery();
    $query->condition('vid', 'area_of_study');
    $query->condition('field_hide_from_listings', 0);
    $query->sort('weight', 'ASC');
    $query->sort('name', 'ASC');
    $query->accessCheck(false);
    $tids = $query->execute();
    $terms = $storage->loadMultiple($tids);

    if(!empty($terms)) {
        $variables['areasOfStudyLinks'] = [];

        foreach($terms as $term) {
            $terms_to_be_cached[] = $term->id();
            
            $variables['areasOfStudyLinks'][] = [
                'title' => $term->getName(),
                'url' => $term->toUrl()->toString(),
            ];

            $cache_tags = Cache::mergeTags($cache_tags, $term->getCacheTags());
        }
    }

    $variables['#cache']['tags'] = !empty($variables['#cache']['tags']) ? Cache::mergeTags($variables['#cache']['tags'], $cache_tags) : $cache_tags;
}