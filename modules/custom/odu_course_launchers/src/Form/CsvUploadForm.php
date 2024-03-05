<?php

namespace Drupal\odu_course_launchers\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\file\Entity\File;
use Drupal\migrate_tools\MigrateExecutable;
use Drupal\odu_course_launchers\UploadMigrateMessage;
use Drupal\Core\File\FileSystemInterface;

/**
 * Manage the CSV file.
 */
class CsvUploadForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'odu_course_launchers_upload_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form = [];
    $form['#attributes']['enctype'] = 'multipart/form-data';

    $validators = [
      'file_validate_extensions' => ['csv'],
    ];

    $form['links'] = [];
    $form['links']['listing'] = [
      '#type' => 'link',
      '#url' => Url::fromUserInput('/admin/course-launchers'),
      '#title' => 'Course Listing',
      '#attributes' => [
        'class' => [
          'button',
        ],
      ],
    ];
    $form['links']['clear_orphans'] = [
      '#type' => 'link',
      '#url' => Url::fromUserInput('/admin/course-csv/clear-orphans'),
      '#title' => 'Clear Migration Map Orphans',
      '#attributes' => [
        'class' => [
          'button',
        ],
        'title' => $this->t('Clear migration records for items that have been deleted.'),
      ],
    ];
    $form['links']['reset_migration'] = [
      '#type' => 'link',
      '#url' => Url::fromUserInput('/admin/course-csv/reset-migration'),
      '#title' => 'Reset Migration',
      '#attributes' => [
        'class' => [
          'button',
        ],
        'title' => $this->t('Use if you see the error: "Migration is busy with another operation".'),
      ],
    ];

    $form['csv_file'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('CSV'),
      '#description' => $this->t('Course launcher export file'),
      '#upload_validators' => $validators,
      '#upload_location' => 'public://csv/',
    ];

    // Get a tid => name options list.
    $query = \Drupal::entityQuery('taxonomy_term')
      ->condition('vid', 'course_semester')->accessCheck(TRUE);
    $tids = $query->execute();
    $terms = \Drupal::service('entity_type.manager')->getStorage('taxonomy_term')->loadMultiple($tids);
    $semesters = array_combine($tids, array_map(function ($term) {
      return $term->getName();
    }, $terms));

    $form['semester'] = [
      '#type' => 'select',
      '#title' => $this->t('Semester'),
      '#description' => $this->t('Edit taxonomy "Course Semester" to add new semesters'),
      '#options' => $semesters,
      '#default_value' => $form_state->getValue('semester'),
    ];

    $form['options'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Options'),
    ];
    $form['options']['update'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Update existing courses matching rows in this CSV (by URL key)'),
      '#default_value' => $form_state->getValue('update', TRUE),
    ];
    $form['options']['delete_missing'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Remove existing courses for this semester not in this CSV'),
      '#description' => $this->t('Warning! To avoid accidental deletion, make sure the correct semester is selected!'),
      '#default_value' => $form_state->getValue('delete_missing', FALSE),
    ];

    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Upload'),
      '#button_type' => 'primary',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    if ($form_state->getValue('csv_file') == NULL) {
      $form_state->setErrorByName('csv_file', $this->t('Need a CSV file.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Stomp to standard filename. See courses migrate config.
    $fid = $form_state->getValue(['csv_file', 0]);
    $semester = $form_state->getValue('semester');
    if (!$form_state->getErrors() && !empty($fid) && !empty($semester)) {
      $file_system = \Drupal::service('file_system');
      $new_filename = "courses.csv";
      $file = File::load($fid);
      $new_filename_uri = "public://csv/{$new_filename}";
      \Drupal::service('file.repository')->move($file, $new_filename_uri, FileSystemInterface::EXISTS_REPLACE);

      // Do some CSV validation.
      $path = $file_system->realpath($new_filename_uri);
      $this->fixCsv($path);

      // Add in the semester term.
      $this->addSemester($path, $semester);

      $messenger = \Drupal::messenger();
      $this->runMigration(
        $messenger,
        $form_state->getValue('update'),
        $form_state->getValue('delete_missing')
      );
      $messenger->addMessage($this->t('Uploaded and imported'), $messenger::TYPE_STATUS);
    }
  }

  /**
   * Basic CSV validation, mostly removing extra whitespace.
   */
  protected function fixCsv($path) {
    $text = file_get_contents($path);
    // Remove whitespace around CSV delimiters.
    $output = preg_replace('/, "/', ',"', $text);
    // Remote whitespace at the end of lines.
    $output = implode("\n", array_filter(array_map('trim', explode("\n", $output))));
    file_put_contents($path, $output);
  }

  /**
   * Inject semester selection into the CSV for import.
   */
  protected function addSemester($path, $semester) {
    $input = file_get_contents($path);

    // Append field to every line.
    $lines = explode(PHP_EOL, $input);
    $header = array_shift($lines);
    $header .= ',"semester"';

    foreach ($lines as $i => $line) {
      $lines[$i] .= ',"' . $semester . '"';
    }

    array_unshift($lines, $header);
    $output = implode("\n", $lines);

    file_put_contents($path, $output);
  }

  /**
   * Run the underlying migration.
   */
  protected function runMigration($messenger, $update = TRUE, $delete_missing = TRUE) {
    $message = new UploadMigrateMessage($messenger);
    $migration = \Drupal::service('plugin.manager.migration')->createInstance('courses');
    $migration->delete_missing_courses = $delete_missing;

    if ($update) {
      $migration->getIdMap()->prepareUpdate();
    }
    $executable = new MigrateExecutable($migration, $message);
    return $executable->import();
  }

}
