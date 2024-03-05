<?php

namespace Drupal\odu_emsi;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\user\EntityOwnerInterface;
use Drupal\Core\Entity\EntityChangedInterface;

/**
 * Provides an interface defining a EMSI Cache entity.
 *
 * @ingroup emsi_cache_entity_example
 */
interface EMSICacheInterface extends ContentEntityInterface, EntityOwnerInterface, EntityChangedInterface {

}
