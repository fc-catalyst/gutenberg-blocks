<?php

namespace FC\GutenbergBlocks;
defined( 'ABSPATH' ) || exit;


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
  
function can_enqueue($block_name) {
    if ( strpos($block_name, FCGB_PREF.'mod-') === 0 ) {return true;} // is modification to an existing block
    if ( wp_is_block_theme() || !has_block( $block_name ) ) { return true; }
    return false;
}

function slug_to_title($slug) {
    $title = str_replace(['-', '_'], ' ', $slug);
    $title = ucwords($title);
    return $title;
}

function list_active_blocks($func = null) {
    $collect = [];
    foreach ( scandir(FCGB_DIR) as $dir ) {
        if ( !is_dir(FCGB_DIR.$dir) ) { continue; }
        if ( in_array( $dir, ['.', '..', 'inc'] ) || in_array( $dir[0], ['-', '.'] ) ) { continue; }
        if ( is_callable($func) ) { $func($dir); }
        $collect[$dir] = slug_to_title($dir);
    }
    return $collect;
}