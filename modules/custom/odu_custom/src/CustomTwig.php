<?php

namespace Drupal\odu_custom;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Drupal\image\Entity\ImageStyle;
use Drupal\Core\Render\Element;
use Drupal\Core\Url;

/**
* Custom twig functions.
*/
class CustomTwig extends AbstractExtension {
    public function getFilters() {
        return [
            new TwigFilter('image_style', [$this, 'imageStyleFilter']),
            // Return an array of the item deltas.
            new TwigFilter('children', [$this, 'children']),
            // Return the URL as a string (from a single delta of a link field)
            new TwigFilter('to_url', function ( $item ) {
                if (!isset($item['#url']) || !$item['#url'] instanceof Url) {
                    return '';
                }
                $url = $item['#url'];
                return $url->toString();
            }),
            // Return a link field delta render array as { title: string, url: string }
            new TwigFilter('to_link_object', function ( $item ) {
                if (!isset($item['#url']) || !$item['#url'] instanceof Url) {
                    return '';
                }
                $url = $item['#url'];
                $url = $url->toString();
                $title = $item['#title'] ?? $url;
                return [
                    'url' => $url,
                    'title' => $title,
                ];
            }),
            // Same as above, except operate at the field level (multiple item deltas).
            new TwigFilter('to_link_objects', function ( $content ) {
                $items = $this->children($content);
                return array_map(function ($item) {
                    if (!isset($item['#url']) || !$item['#url'] instanceof Url) {
                        return '';
                    }
                    $url = $item['#url'];
                    $url = $url->toString();
                    $title = $item['#title'] ?? $url;
                    return [
                        'url' => $url,
                        'title' => $title,
                    ];
                }, $items);
            }),
            // Same as above, just return title temp change).
            new TwigFilter('to_text_objects', function ( $content ) {
                $items = $this->children($content);
                return array_map(function ($item) {
                    $title = $item['#title'] ?? '';
                    return [
                        'title' => $title
                    ];
                }, $items);
            }),
            new TwigFilter('inject_template', function ( $content ) {
                if(is_array($content) && array_key_exists('attributes', $content)) {
                    unset($content['attributes']);
                }

                return $content;
            }),
            // Get a (Vimeo) video ID from a URL.
            new TwigFilter('get_video_id', [$this, 'getVideoId']),
            // From a field render array, generate an icon.
            new TwigFilter('icon', [$this, 'renderIcon'], ['is_safe' => ['html']]),
            // Fetch field values from a reference field (like get term names from a reference field).
            new TwigFilter('map_entity_field', [$this, 'mapEntityField']),
            // Sort an entity reference by values on the target entity.
            new TwigFilter('sort_entity_field', [$this, 'sortEntityField']),
            // Build a render array from a field.
            new TwigFilter('field_view', [$this, 'fieldView']),
            // Change a display mode
            new TwigFilter('view_mode', [$this, 'setViewMode']),
             // html_decode_entities
            new TwigFilter('unescape', [$this, 'unescape']),
            new TwigFilter('update_view_mode', [$this, 'updateViewMode']),
        ];
    }
    
    public function getFunctions() {
        return [
            new TwigFunction('is_front_page', [$this, 'isFrontPage']),
            new TwigFunction('is_current_page', [$this, 'isCurrentPage']),
            new TwigFunction('open_secondary_nav', [$this, 'openSecondaryNav']),
            // Get entity display mode
            new TwigFunction('drupal_entity', [$this, 'drupalEntity']),
            new TwigFunction('drupal_view', 'views_embed_view')
        ];
    }
    
    public function getVideoId($url) {
        $id = '';
        
        if(!empty($url)) {
            $url_parts = parse_url($url);
            
            if(!empty($url_parts['path'])) {
                $id = trim($url_parts['path'], '/');
            }
        }
        
        return $id;
    }
    
    public function imageStyleFilter(?string $path, string $style): ?string {
        if (!$path) {
            trigger_error('Image path is empty.');
            return NULL;
        }
        
        if (!$image_style = ImageStyle::load($style)) {
            trigger_error(sprintf('Could not load image style %s.', $style));
            return NULL;
        }
        
        if (!$image_style->supportsUri($path)) {
            trigger_error(sprintf('Could not apply image style %s.', $style));
            return NULL;
        }
        
        return \Drupal::service('file_url_generator')
        ->transformRelative($image_style->buildUrl($path));
    }
    
    public function isFrontPage() {
        return \Drupal::service('path.matcher')->isFrontPage();
    }
    
    public function children($build) {
        if (empty($build)) {
            return [];
        }
        $keys = Element::children($build);
        return array_intersect_key($build, array_fill_keys($keys, 0));
    }
    
    public function renderIcon($build) {
        if (is_string($build)) {
            $children = [
                ['#value' => $build],
            ];
        }
        else {
            $children = $this->children($build);
        }
        $output = [];
        foreach ($children as $child) {
            if (!isset($child['#value'])) {
                continue;
            }
            $xml = simplexml_load_string($child['#value']);
            if ($xml === false) {
                continue;
            }
            $dom = dom_import_simplexml($xml);
            if (!$dom) {
                continue;
            }
            
            $doc = new \DOMDocument();
            $cloned = $dom->cloneNode(TRUE);
            $doc->appendChild($doc->importNode($cloned, TRUE));
            
            foreach (['svg', 'g', 'path', 'rect'] as $tag) {
                foreach ($doc->getElementsByTagName($tag) as $child) {
                    // if ($child->hasAttribute('fill')) {
                    //     $child->setAttribute('fill', 'currentColor');
                    // }
                    $child->removeAttribute('class');
                    $child->removeAttribute('id');
                    
                    if ($child->tagName == 'svg') {
                        $child->removeAttribute('height');
                        $child->removeAttribute('width');
                        // $child->setAttribute('fill', 'currentColor');
                    }
                }
            }
            
            $svg = $doc->saveHTML();
            
            // Render array.
            $build = [
                '#type' => 'processed_text',
                '#format' => 'full_html',
                '#text' => $svg,
            ];
            $output[] = $build;
        }
        return $output;
    }
    
    public function mapEntityField($field, $entity_field_name = 'name', $entity_field_property = 'value', $linked = FALSE) {
        $output = [];
        foreach ($field as $item) {
            $entity = $item->entity;
            if ($entity->hasField($entity_field_name)) {
                $entity_field = $entity->get($entity_field_name);
                $v = $entity_field->first()->getValue($entity_field_property);
                if (isset($v[$entity_field_property])) {
                    if ($linked) {
                        $link = [
                            '#type' => 'link',
                            '#title' => $v[$entity_field_property],
                            '#url' => $entity->toUrl(),
                        ];
                        $output[] = $link;
                    }
                    else {
                        $output[] = $v[$entity_field_property];
                    }
                }
            }
        }
        return $output;
    }
    
    public function sortEntityField($field, $entity_field_name = 'name', $entity_field_property = 'value') {
        $order = $this->mapEntityField($field, $entity_field_name, $entity_field_property);
        asort($order);
        
        if (count($order) != count($field)) {
            // Bail out.
            return $field;
        }
        
        // Use the order keys to custom-reorder $field.
        return array_map(function ($i) use ($field) {
            return $field[$i];
        }, array_keys($order));
    }
    
    public function isCurrentPage($url) {
        if(is_object($url)) {
            $url = $url->isRouted() ? $url->getInternalPath() : $url->toString();
        }
        
        $url = trim($url, '/');
        $current_path = \Drupal::service('path.current')->getPath();
        $current_path = trim($current_path, '/');
        
        return $url == $current_path;
    }
    
    /**
     * Create a field render array.
     */
    public function fieldView($field, $options = NULL) {
        if (is_null($options)) {
            $options = ['label' => 'hidden'];
        }
        if (is_object($field) && method_exists($field, 'view')) {
            return $field->view($options);
        }
        return [];
    }

    public function openSecondaryNav() {
        $url_parts = [];

        $current_url = \Drupal::request()->getRequestUri();
        
        if(!empty($current_url)) {
            $current_url = trim($current_url, '/');
            $url_parts = explode('/', $current_url);
        }

        return count($url_parts) == 1;
    }

    public function setViewMode($build, $mode = 'default', $cache_context = 'url.path') {
        if (isset($build['#view_mode'])) {
            $build['#view_mode'] = $mode;
            $build['#cache']['contexts'][] = $cache_context;
        }
        return $build;
    }

    public function updateViewMode($build, $mode = 'default') {
        if(!empty($build)) {
            foreach($build as $key => $item) {
                if(isset($item['#view_mode'])) {
                    $build[$key]['#view_mode'] = $mode;
                    $build[$key]['#cache']['contexts'][] = 'url.path';
                }
            }
        }
        
        return $build;
    }

    /**
    * Returns the render array to represent an entity.
    */
    public static function drupalEntity($entity, $view_mode = 'full') {
        if ($entity) {
            return \Drupal::service('odu_custom.entity_view_builder')
            ->build($entity, $view_mode, null, true);
        }

        return [];
    }

    public function unescape($value) {
        return html_entity_decode($value);
    }
}
