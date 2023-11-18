<?php

namespace FC\GutenbergBlocks;
defined( 'ABSPATH' ) || exit;


// easy access to reusable blocks/* reusable blocks to the menu */
add_action( 'admin_menu', function() {
    add_menu_page(
        'Reusable Gutenberg Blocks',   // Page title
        'Reusable Blocks',             // Menu title
        'manage_options',              // Capability required to access the page
        'edit.php?post_type=wp_block', // URL or slug for the page
        '',                            // Function to render the page (empty, as we just want a link)
        'dashicons-block-default',     // Icon URL or Dashicon class (using default block icon)
        25                             // Position in the left menu (adjust as needed)
    );
});


add_action('after_setup_theme', function() {
    // Add theme support for wide and full alignment options
    add_theme_support('align-wide');

    // turn on the editor's styles
    add_theme_support( 'editor-styles' );
    add_editor_style();
});