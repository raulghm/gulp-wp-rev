


<?php
/**
 * Enqueue scripts and stylesheets
 *
 * Simple example
 */

function my_assets_function() {
  wp_enqueue_style('my_assets', get_template_directory_uri() . '/assets/styles/styles.css', false, '99751aae501b70d8edb1be6d827adefd');
  wp_register_script('my_assets', get_template_directory_uri() . '/assets/scripts/scripts.js', array(), '892354e5fc462fba85da60adb9b87ce7');
  wp_enqueue_script('my_assets');
}

add_action('wp_enqueue_scripts', 'my_assets_function', 10);


