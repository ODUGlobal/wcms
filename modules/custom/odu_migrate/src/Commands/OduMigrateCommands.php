<?php
namespace Drupal\odu_migrate\Commands;

use Drush\Commands\DrushCommands;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\views\Views;
use Symfony\Component\Yaml\Yaml;

class OduMigrateCommands extends DrushCommands {

    protected $entityTypeManager;
    protected $entityRepository;
    protected $fileSystem;

    public function __construct(EntityTypeManagerInterface $entity_type_manager, FileSystemInterface $file_system) {
        $this->entityTypeManager = $entity_type_manager;
        $this->fileSystem = $file_system;
    }

    /**
   * Drush command to save uuid and entity id in a csv.
   * 
   * @command export-uuid
   * @aliases euuid
   */
    public function exportUuid() {
        $file = $this->fileSystem->realpath('public://') . '/uuid.csv';
        $handle = fopen($file, 'w');

        $entity_types = ['taxonomy_term', 'node', 'media'];
        
        foreach($entity_types as $type) {
            $entities = $this->entityTypeManager->getStorage($type)->loadMultiple();
        
            foreach($entities as $entity) {
                $uuid = $entity->uuid();
                $id = $entity->id();
                fputcsv($handle, [$type, $uuid, $id]);
            }
        }

        fclose($handle);

        $this->output()->writeln('exported uuids to uuid.csv');
    }

       /**
   * Drush command to save uuid and entity id in a csv.
   * 
   * @command update-links
   * @aliases ulinks
   */
    public function updateLinks() {
        $ids = [];
        $fields = [
            'collection_item' => ['field_link', 'field_links'],
            'external_link' => ['field_link'],
            'paragraph' => ['field_fancy_link', 'field_link', 'field_links'],
            'relationship' => ['field_link'],
            'reusable_block' => ['field_links'],
            'taxonomy_term' => ['field_link', 'field_links']
        ];

        // Get the file path to a module
        $module_handler = \Drupal::service('module_handler');
        $module_path = $module_handler->getModule('odu_migrate')->getPath();
        $file = $module_path . '/csv/uuid.csv';
        
        if (($handle = fopen($file, 'r')) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $ids[$data[0].'/'.$data[2]] = ['uuid' => $data[1], 'type' => $data[0]];
            }
        }

        //$this->output()->writeln(print_r($ids, true));

        if(!empty($ids)) {
            foreach($fields as $entity_type => $field_names) {
                $entities = $this->entityTypeManager->getStorage($entity_type)->loadMultiple();
                
                if(!empty($entities)) {
                    foreach($entities as $entity) {
                        foreach($field_names as $field_name) {
                            if($entity->hasField($field_name)) {
                                $values = $entity->get($field_name)->getValue();
                                
                                if(!empty($values)) {
                                    foreach($values as $key => $value) {
                                        if(!empty($value['uri']) && (strpos($value['uri'], 'internal:/') !== FALSE || strpos($value['uri'], 'entity:') !== FALSE)) {
                                            $uri = str_replace(['internal:/', 'entity:'], '', $value['uri']);

                                            if(strpos($uri, '#') !== FALSE) {
                                                $uri = substr($uri, 0, strrpos($uri, '#'));
                                            }
                                            
                                            if(array_key_exists($uri, $ids)) {
                                                $updated_entity = $this->entityTypeManager->getStorage($ids[$uri]['type'])->loadByProperties(['uuid' => $ids[$uri]['uuid']]);
                                                
                                                if(!empty($updated_entity)) {
                                                    $updated_entity = reset($updated_entity);
                                                    $this->output()->writeln('old ' . $value['uri']);
                                                    $values[$key]['uri'] = str_replace($uri, $updated_entity->getEntityTypeId() . '/' . $updated_entity->id(), $value['uri']);
                                                    $this->output()->writeln('updated ' . $value['uri']);
                                                }
                                                else {
                                                    $this->output()->writeln('no entity found for ' . $value['uri']);
                                                }
                                            }
                                            else {
                                                $this->output()->writeln('no uuid found for ' . $value['uri']);
                                            }
                                        }
                                    }

                                    $entity->set($field_name, $values);
                                }
                            }
                        }

                        $entity->save();
                    }
                }
            }
        }
    }

    /**
   * Drush command to save uuid and entity id in a csv.
   * 
   * @command migrate-media
   * @aliases migm
   */
    public function migrateMedia() {
        $non_existing_media = [];

        $dir = 'public://import/media';
        $file_system = \Drupal::service('file_system');

        $files = $file_system->scanDirectory($dir, '/\.(yml)$/');

        foreach ($files as $file) {
            if(!empty($file->uri)) {
                $file = \Drupal::service('file_system')->realpath($file->uri);
                $data = Yaml::parseFile($file);

                if(!empty($data)) {
                    $media = $this->entityTypeManager->getStorage('media')->loadByProperties(['uuid' => $data['uuid']]);
                    
                    if(empty($media)) {
                        $non_existing_media[] = $data['uuid'];
                    }
                }
            }
        }

        $this->output()->writeln(implode(',', $non_existing_media));
    }

       /**
   * Drush command to save uuid and entity id in a csv.
   * 
   * @command links-old-to-new
   * @aliases lotn
   */
    public function getNewLinksUrl() {
        $module_handler = \Drupal::service('module_handler');
        $module_path = $module_handler->getModule('odu_migrate')->getPath();
        $file = $module_path . '/csv/uuid.csv';

        if (($handle = fopen($file, 'r')) !== FALSE) {
            $new_file = $this->fileSystem->realpath('public://') . '/old-to-new-urls.csv';
            $new_handle = fopen($new_file, 'w');
            
            fputcsv($new_handle, ['OLD URL (with id)', 'NEW URL']);
            
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $entity = $this->entityTypeManager->getStorage($data[0])->loadByProperties(['uuid' => $data[1]]);
                $old_url = '';

                if(!empty($entity)) {
                    $entity = reset($entity);

                    switch($data[0]) {
                        case 'node':
                            $old_url = 'node/' . $data[2];
                            $new_url = \Drupal::service('path_alias.manager')->getAliasByPath('/node/'.$entity->id());
                        break;
                        case 'media':
                            //$old_url = 'media/' . $data[2];
                        break;
                        case 'taxonomy_term':
                            $old_url = 'taxonomy/term/' . $data[2];
                            $new_url = \Drupal::service('path_alias.manager')->getAliasByPath('/taxonomy/term/'.$entity->id());
                        break;
                    }

                    if(!empty($old_url) && !empty($new_url)) {
                        fputcsv($new_handle, [$old_url, $new_url]);
                    }
                } 
            }

            fclose($new_handle);
        }

        fclose($handle);

        $this->output()->writeln('file created');  
    }
    /**
    * Drush command to get all viewfields.
   * 
   * @command get-view-fields
   * @aliases gvf
   */
    public function getViewFields() {
        $yml = [];
        $storage = $this->entityTypeManager->getStorage('collection_item');
        $collections = $storage->loadByProperties(['type' => 'listing']);

        foreach($collections as $collection) {
            $values = $collection->get('field_view')->getValue();
            
            if(!empty($values)) {
                foreach($values as $row) {
                    $array = [];

                    if(!empty($row['arguments']) && substr($row['arguments'], 0, 1) != '[') {
                        $view = Views::getView($row['target_id']);

                        if($view) {
                            $entity_type = $view->getBaseEntityType();

                            if(!empty($entity_type)) {
                                $array = [
                                    'uuid' => $collection->uuid(),
                                    'entity_type' => $entity_type->get('id'),
                                    'entities' => []
                                ];

                                $args = explode(', ', $row['arguments']);
                                $entities = $this->entityTypeManager->getStorage($entity_type->get('id'))->loadMultiple($args);
                                
                                if(!empty($entities)) {
                                    foreach($entities as $entity) {
                                        $array['entities'][] = [
                                            'uuid' => $entity->uuid(),
                                            'id' => $entity->id()
                                        ];
                                    }
                                }
                            }
                        }
                    }

                    if(!empty($array)) {
                        $yml[] = $array;
                    }
                }
            }
        }

        if(!empty($yml)) {
            $file = $this->fileSystem->realpath('public://') . '/view-fields.yml';
            $yaml = Yaml::dump($yml);
            file_put_contents($file, $yaml);
        }

        $this->output()->writeln('file created');
    }
}