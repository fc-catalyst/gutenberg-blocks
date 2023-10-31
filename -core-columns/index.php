<?php

$block_mod_name = FCGB_PREF.basename( __DIR__ );
$block_dir_url = get_template_directory_uri() . '/gutenberg/'. basename( __DIR__ );
$block_type_name = FCGB_SLUG.'/'.basename( __DIR__ );

add_action( 'enqueue_block_editor_assets', function() use ($block_mod_name, $block_type_name) {

    $block_path = __DIR__ . '/block.js';
    $script_contents = file_get_contents( $block_path );

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

    $style_path = __DIR__ . '/style.css';
    $style_contents = file_get_contents( $style_path );

});

add_action( 'current_screen', function($screen) use ($block_dir_url) { // for block theme editor // ++ check if the next enqueue loads the script second time
    if( $screen->base !== 'site-editor' ) return;
    add_editor_style( $block_dir_url.'/style.css' );
});
add_action( 'enqueue_block_editor_assets', function() use ($block_dir_url) { // for common editor
    add_editor_style( $block_dir_url.'/style.css' );
});

add_action( 'wp_enqueue_scripts', function() use ($block_mod_name) {

    $style_path = __DIR__ . '/style.css';
    $style_contents = file_get_contents( $style_path );

    wp_register_style( $block_mod_name, false );
    wp_enqueue_style( $block_mod_name );
    wp_add_inline_style( $block_mod_name, FCGB_DEV ? $style_contents : css_minify( $style_contents ) );
});