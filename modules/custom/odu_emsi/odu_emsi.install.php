<?php

/**
 * Implements hook_uninstall().
 */
function odu_emsi_uninstall() {
  \Drupal::database()->schema()->dropTable('migrate_map_emsi');
  \Drupal::database()->schema()->dropTable('migrate_message_emsi');
  Drupal::configFactory()->getEditable('migrate_plus.migration.emsi')->delete();

  // To update:
  // drush migrate-import emsi --update
  // drush cr
  // .
}
