<?php

$block_name = 'pll-switcher'; // basename( __DIR__ ) //++add optins to print different h and or.. maybe limit to sections type

add_action( 'init', function() use ( $block_name ) {

    $print_block = function( $props, $content = null ) use ( $block_name ) {

        if ( !function_exists( 'pll_the_languages' ) ) { return ''; }

        return array_reduce( pll_the_languages( [ 'raw' => 1 ] ), function( $result, $item ) {
            if ( $item['current_lang'] ) { return $result; }
            $result .= '<nav class="wp-block-navigation"><a href="'.$item['url'].'" class="pll-language-switcher">'.$item['slug'].'</a></nav>';
            return $result;
        }, '' );

    };

    fc-reis-info-box-main( 'fct-gutenberg/' . $block_name, [
        'editor_script' => 'fct-' . $block_name . '-block',
        'render_callback' => $print_block
    ] );

    wp_register_script(
        'fct-' . $block_name . '-block',
        get_template_directory_uri() . '/gutenberg/' . $block_name . '/block.js',
        ['wp-blocks', 'wp-element'],
        FCGB_VER
    );

});
