<?php
namespace Drupal\odu_custom\Plugin\Filter;

use Drupal\Component\Utility\Html;
use Drupal\filter\Plugin\FilterBase;
use Drupal\filter\Plugin\FilterInterface;
use Drupal\filter\FilterProcessResult;

/**
 * Provides a filter to display embedded entities based on data attributes.
 *
 * @Filter(
 *   id = "image_alignment",
 *   title = @Translation("Set alignment on embeded images."),
 *   description = @Translation("Adds alignment to embeded images."),
 *   type = Drupal\filter\Plugin\FilterInterface::TYPE_TRANSFORM_REVERSIBLE,
 *   weight = 5,
 * )
 */
class InageAlignment extends FilterBase implements FilterInterface {
    /**
    * {@inheritdoc}
    */
    public function process($text, $langcode) {
        $result = new FilterProcessResult($text);
        $dom = Html::load($text);

        if(strpos($text, 'data-entity-type') !== FALSE) {
            $xpath = new \DOMXPath($dom);

            foreach ($xpath->query('//drupal-entity[@data-entity-type]') as $node) {
                $class = 'tw-align-none';

                if($node->hasAttribute('data-align')) {
                    $class = 'tw-align-' . $node->getAttribute('data-align');
                    $node->removeAttribute('data-align');
                }
                $alignment = $node->getAttribute('data-align');

                $wrapper = $dom->createElement('div');
                $wrapper->setAttribute('class', 'wysiwyg-embed '.$class);

                $cloned_element = $node->cloneNode(true);
                $wrapper->appendChild($cloned_element);

                $node->parentNode->replaceChild($wrapper, $node);
            }
        }

        $result->setProcessedText(Html::serialize($dom));
        
        return $result;
    }

    /**
    * {@inheritdoc}
    */
    public function tips($long = FALSE) {
        return $this->t('Adds alignment to embeded images.');
    }
}