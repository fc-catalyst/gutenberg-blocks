<?php
/*
Plugin Name: FC Gutenberg Blocks
Plugin URI: https://github.com/VVolkov833/gutenberg-blocks
GitHub Plugin URI: https://github.com/VVolkov833/gutenberg-blocks
Description: Add various gutenberg blocks
Version: 0.1.2
Requires at least: 6.0
Tested up to: 6.3
Requires PHP: 7.4
Author: Firmcatalyst, Vadim Volkov
Author URI: https://firmcatalyst.com/about/
License: GPL v3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html
*/

/**
 * -*    - dir to be ignored
 * mod-* - dir for modifications to load files without the block presence check
 * files to add are: editor.css, style.css, block.js, script.js
 * *-inline* - like style-inline.css or script-inline.css - adds the content inline
 * script-defer.js - defers the script loading
 */

namespace FC\GutenbergBlocks;
defined( 'ABSPATH' ) || exit;

define( 'FCGB_DEV', false ); // developer mode for not caching the js and css
define( 'FCGB_VER', '0.1.2'.FCGB_DEV ? time() : '' );

define( 'FCGB_SLUG', 'fc' );
define( 'FCGB_PREF', FCGB_SLUG.'-' );
define( 'FCGB_PLUGIN', FCGB_PREF.'-'.'gutenberg' );

define( 'FCGB_URL', plugin_dir_url( __FILE__ ) );
define( 'FCGB_DIR', plugin_dir_path( __FILE__ ) );


@require_once( __DIR__ . '/inc/functions.php' );
@require_once( __DIR__ . '/inc/settings.php' );
@require_once( __DIR__ . '/inc/form-fields.php' );
@require_once( __DIR__ . '/inc/settings-page.php' );


// collect the blocks
$active_blocks = get_option( FCGB_PLUGIN )['active-blocks'] ?? [];
list_active_blocks( function($dir) use ($active_blocks) {
  if ( !in_array($dir, $active_blocks) ) { return; }
  unset( $print_function );
  @include_once( FCGB_DIR.$dir.'/index.php' );
  enqueue_files( $dir, $print_function ?? null );
});


function enqueue_files($dir, $print_function = null) {

  $block_name = FCGB_PREF. $dir; // for scripts & styles naming
  $block_type_name = FCGB_PREF.basename(__DIR__).'/'.$dir; // for naming blocks in Gutenberg
  $block_dir_src = FCGB_DIR. $dir;
  $block_dir_url = FCGB_URL. $dir;


  // render callback
  if ( $print_function ) {
    add_action( 'init', function() use ($block_name, $block_type_name, $print_function) {

      $print_block = function($props, $content = null) use ($block_name, $block_type_name, $print_function) {
          ob_start();
          $print_function($props, $content = null, $block_name);
          $content = ob_get_contents();
          ob_end_clean();
          return $content;
      };

      register_block_type( $block_type_name, [
          'render_callback' => $print_block,
      ]);
    });
  }


  // editor settings / scripts
  $block_file_path = $block_dir_src . '/block.js';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'enqueue_block_editor_assets', function() use ($block_file_path, $block_name, $block_type_name, $block_dir_src, $block_dir_url) {

      $script_contents = file_get_contents( $block_file_path ); // inlined to use variables without defining globals

      $icon_src = is_file( $block_dir_src.'/icon.svg' ) ? $block_dir_url.'/icon.svg' : null;

      $inline_script  = '
          (() => {
              const prefix = "' . esc_js( $block_name.'-' ) . '";
              const blockName = "' . esc_js( $block_type_name ) . '";
              const title = "' . esc_js( slug_to_title( $block_name ) ) . '";
              const iconSrc = "'.(isset( $icon_src ) ? esc_js( $icon_src ) : '' ).'";
              '.$script_contents.'
          })();
      ';

      wp_register_script( $block_name, '', ['wp-blocks', 'wp-components', 'wp-element', 'wp-editor', 'wp-data'] );
      wp_enqueue_script( $block_name );
      wp_add_inline_script( $block_name, $inline_script );

    });
  }

  // editor style
  $block_file_path = $block_dir_src . '/editor.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'current_screen', function($screen) use ($block_dir_url) { // for block theme editor // ++ check if the next enqueue loads the script second time O_o
      if( $screen->base !== 'site-editor' ) return;
      add_editor_style( $block_dir_url.'/editor.css'.'?ver='.FCGB_VER );
    });
    add_action( 'enqueue_block_editor_assets', function() use ($block_dir_url) { // for common editor
        add_editor_style( $block_dir_url.'/editor.css'.'?ver='.FCGB_VER );
    });
  }

  $block_file_path = $block_dir_src . '/editor-sidebar.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'admin_enqueue_scripts', function() use ($block_name, $block_dir_url) {
      $current_screen = get_current_screen();

      if ( !in_array($current_screen->base, ['post', 'theme-editor']) ) { return; }

      wp_register_style( $block_name, $block_dir_url.'/editor-sidebar.css', [], FCGB_VER );
      wp_enqueue_style( $block_name );
    });
  }
  // editor sidebar style

  // ------------visitors' end-------------
  if ( is_admin() ) { return; }

  // block style
  $block_file_path = $block_dir_src . '/style.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'wp_enqueue_scripts', function() use ($block_name, $block_dir_url) {

      if ( !can_enqueue($block_name) ) { return; }

      wp_register_style( $block_name, $block_dir_url.'/style.css', [], FCGB_VER );
      wp_enqueue_style( $block_name );
    });
  }

  // block style inline
  $block_file_path = $block_dir_src . '/style-inline.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'wp_enqueue_scripts', function() use ($block_file_path, $block_name) {

      if ( !can_enqueue($block_name) ) { return; }

      $style_contents = file_get_contents( $block_file_path );

      wp_register_style( $block_name, false );
      wp_enqueue_style( $block_name );
      wp_add_inline_style( $block_name, FCGB_DEV ? $style_contents : css_minify( $style_contents ) );
    });
  }

  // there is no easy way to defer style, so style-defer.css is skipped

  // block script
  $block_file_path = $block_dir_src . '/script.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'wp_enqueue_scripts', function() use ($block_name, $block_dir_url) {

      if ( !can_enqueue($block_name) ) { return; }

      wp_register_script( $block_name, $block_dir_url.'/script.css', [], FCGB_VER );
      wp_enqueue_script( $block_name );
    });
  }

  // block script defer
  $block_file_path = $block_dir_src . '/script-defer.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'wp_enqueue_scripts', function() use ($block_name, $block_dir_url) {

      if ( !can_enqueue($block_name) ) { return; }

      wp_register_script( $block_name, $block_dir_url.'/script.css', [], FCGB_VER, ['strategy' => 'defer'] );
      wp_enqueue_script( $block_name );
    });
  }

  // block script inline
  $block_file_path = $block_dir_src . '/script-inline.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'wp_enqueue_scripts', function() use ($block_file_path, $block_name) {

      if ( !can_enqueue($block_name) ) { return; }

      $script_contents = file_get_contents( $block_file_path );

      wp_register_script( $block_name, false );
      wp_enqueue_script( $block_name );
      wp_add_inline_script( $block_name, $script_contents );
    });
  }

}

// ++add settings page to activate particular blocks
// ++make index.php independent, only block.js meters
// ++settings button to plugins list
// ++publish?