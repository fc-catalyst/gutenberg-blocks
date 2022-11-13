<?php

/**
 * Plugin Name: FCP Gutenberg Blocks
 * Plugin URI: https://firmcatalyst.com
 * Description: Add Gutenberg blocks for blog and schedule
 * Version: 0.0.3
 * Author: Firmcatalyst, Vadim Volkov
  */

defined( 'ABSPATH' ) || exit;

// include all gutenberg blocks from surrounding dirs, whicn don't start with --
foreach ( scandir( __DIR__ ) as $v ) {
  if ( $v == '.' || $v == '..' || $v[0] === '-' ) { continue; }
  $block_name = preg_replace( '/[^a-z0-9\-_]/', '', $v );
  @include_once( __DIR__ . '/' . $v . '/index.php' );
}



// list of controls
// https://developer.wordpress.org/block-editor/reference-guides/components/text-control/
