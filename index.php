<?php
/*
Plugin Name: FCP Gutenberg Blocks
Plugin URI: https://github.com/VVolkov833/gutenberg-blocks
GitHub Plugin URI: https://github.com/VVolkov833/gutenberg-blocks
Description: Add various gutenberg blocks
Version: 0.0.4
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
define( 'FCGB_VER', wp_get_theme()->get( 'Version' ).FCGB_DEV ? time() : '' );

define( 'FCGB_SLUG', 'fc' );
define( 'FCGB_PREF', FCGB_SLUG.'-' );

define( 'FCGB_URL', plugin_dir_url( __FILE__ ) );
define( 'FCGB_DIR', plugin_dir_path( __FILE__ ) );


// turn on the editor's styles
add_action( 'after_setup_theme', function() {
	add_theme_support( 'editor-styles' );
	add_editor_style();
});


// collect the blocks
foreach ( scandir( __DIR__ ) as $dir ) {
  if ( in_array( $dir, ['.', '..'] ) || in_array( $dir[0], ['-', '.'] ) ) { continue; }
  @include_once( __DIR__ . '/' . $dir . '/index.php' );
  enqueue_files( $dir, $block_settings );
  unset( $block_settings );
}

// functions

function enqueue_files($dir, $block_settings) {

  $block_mod_name = FCGB_PREF. $dir;
  $block_type_name = FCGB_PREF.basename(__DIR__).'/'.$dir;
  $block_dir_src = FCGB_DIR. $dir;
  $block_dir_url = FCGB_URL. $dir;

  

  // editor settings
  $block_file_path = $block_dir_src . '/block.js';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'enqueue_block_editor_assets', function() use ($block_file_path, $block_mod_name, $block_type_name) {

      $script_contents = file_get_contents( $block_file_path );

      $inline_script  = '
          (() => {
              const prefix = "' . esc_js( $block_mod_name.'-' ) . '";
              const blockModName = "' . esc_js( $block_type_name ) . '";
              '.$script_contents.'
          })();
      ';

      wp_register_script( $block_mod_name, '' ); // to use variables without defining globals
      wp_enqueue_script( $block_mod_name );
      wp_add_inline_script( $block_mod_name, $inline_script );

    });
  }

  // editor style
  $block_file_path = $block_dir_src . '/editor.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'current_screen', function($screen) use ($block_dir_url) { // for block theme editor // ++ check if the next enqueue loads the script second time
      if( $screen->base !== 'site-editor' ) return;
      add_editor_style( $block_dir_url.'/editor.css' );
    });
    add_action( 'enqueue_block_editor_assets', function() use ($block_dir_url) { // for common editor
        add_editor_style( $block_dir_url.'/editor.css' );
    });
  }

  // visitors' end
  if ( is_admin() ) { return; }

  // block style
  $block_file_path = $block_dir_src . '/style.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'wp_enqueue_scripts', function() use ($block_mod_name, $block_settings) {

      if ( !wp_is_block_theme() && !has_block( $block_mod_name ) && !$block_settings->ignore_block_absence ) { return; }

      wp_register_style( $block_mod_name, $block_dir_url.'/style.css', [], FCGB_VER );
      wp_enqueue_style( $block_mod_name );
    });
  }

  // block style inline
  $block_file_path = $block_dir_src . '/style-inline.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'wp_enqueue_scripts', function() use ($block_file_path, $block_mod_name, $block_settings) {

      if ( !wp_is_block_theme() && !has_block( $block_mod_name ) && !$block_settings->ignore_block_absence ) { return; }

      $style_contents = file_get_contents( $block_file_path );

      wp_register_style( $block_mod_name, false );
      wp_enqueue_style( $block_mod_name );
      wp_add_inline_style( $block_mod_name, FCGB_DEV ? $style_contents : css_minify( $style_contents ) );
    });
  }

  // block script
  $block_file_path = $block_dir_src . '/script.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'wp_enqueue_scripts', function() use ($block_mod_name, $block_settings) {

      if ( !wp_is_block_theme() && !has_block( $block_mod_name ) && !$block_settings->ignore_block_absence ) { return; }

      wp_register_script( $block_mod_name, $block_dir_url.'/script.css', [], FCGB_VER );
      wp_enqueue_script( $block_mod_name );
    });
  }

  // block script inline
  $block_file_path = $block_dir_src . '/script-inline.css';
  if ( file_exists( $block_file_path ) ) {
    add_action( 'wp_enqueue_scripts', function() use ($block_file_path, $block_mod_name, $block_settings) {

      if ( !wp_is_block_theme() && !has_block( $block_mod_name ) && !$block_settings->ignore_block_absence ) { return; }

      $script_contents = file_get_contents( $block_file_path );

      wp_register_script( $block_mod_name, false );
      wp_enqueue_script( $block_mod_name );
      wp_add_inline_script( $block_mod_name, $script_contents );
    });
  }

}


function css_minify($css) {
  $preg_replace = function($regexp, $replace, $string) { // avoid null result so that css still works even though not fully minified
      return preg_replace( $regexp, $replace, $string ) ?: $string . '/* --- failed '.$regexp.', '.$replace.' */';
  };
  $css = $preg_replace( '/\s+/', ' ', $css ); // one-line & only single speces
  $css = $preg_replace( '/ ?\/\*(?:.*?)\*\/ ?/', '', $css ); // remove comments
  $css = $preg_replace( '/ ?([\{\};:\>\~\+]) ?/', '$1', $css ); // remove spaces
  $css = $preg_replace( '/\+(\d|var)/', ' + $1', $css ); // restore spaces in functions
  $css = $preg_replace( '/(?:[^\}]*)\{\}/', '', $css ); // remove empty properties
  $css = str_replace( [';}', '( ', ' )'], ['}', '(', ')'], $css ); // remove last ; and spaces
  // ++ should also remove 0 from 0.5, but not from svg-s?
  // ++ try replacing ', ' with ','
  // ++ remove space between %3E %3C and before %3E and /%3E
  return trim( $css );
}

// ++add settings page to activate particular blocks