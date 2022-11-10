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
    $incl = __DIR__ . '/' . $v . '/index.php';
    if ( $v === '.' || $v === '..' || !is_file( $incl ) || substr( $v, 0, 2 ) === '--' ) { continue; }
    include_once( $incl );
}
