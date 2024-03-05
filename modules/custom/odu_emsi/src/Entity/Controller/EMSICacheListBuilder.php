<?php

namespace Drupal\odu_emsi\Entity\Controller;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;

/**
 * Provides a list controller for odu_emsi_emsi_cache entity.
 *
 * @ingroup odu_emsi
 */
class EMSICacheListBuilder extends EntityListBuilder {

  /**
   * {@inheritdoc}
   *
   * We override ::render() so that we can add our own content above the table.
   * parent::render() is where EntityListBuilder creates the table using our
   * buildHeader() and buildRow() implementations.
   */
  public function render() {
    $build['description'] = [
      '#markup' => $this->t('ODU EMSI implements a EMSI Cache model. These emsi caches are fieldable entities. You can manage the fields on the <a href="@adminlink">EMSI Cache admin page</a>.', [
        '@adminlink' => \Drupal::urlGenerator()
          ->generateFromRoute('odu_emsi.emsi_cache_settings'),
      ]),
    ];

    $build += parent::render();
    return $build;
  }

  /**
   * {@inheritdoc}
   *
   * Building the header and content lines for the emsi cache list.
   *
   * Calling the parent::buildHeader() adds a column for the possible actions
   * and inserts the 'edit' and 'delete' links as defined for the entity type.
   */
  public function buildHeader() {
    $header['id'] = $this->t('EMSICacheID');
    $header['program_id'] = $this->t('Program ID');
    $header['career_data'] = $this->t('Career Data');
    $header['emsi_slug'] = $this->t('EMSI Slug');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\odu_emsi\Entity\EMSICache */
    $row['id'] = $entity->id();
    $row['program_id'] = $entity->program_id->value;
    $row['career_data'] = $entity->career_data->value;
    $row['emsi_slug'] = $entity->emsi_slug->value;
    return $row + parent::buildRow($entity);
  }

}
