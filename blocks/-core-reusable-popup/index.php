<?php

$block_name = FCGB_PREF.basename( __DIR__ );
$block_dir_url = get_template_directory_uri() . '/gutenberg/'. basename( __DIR__ );
$block_type_name = FCGB_SLUG.'/'.basename( __DIR__ );

add_action( 'enqueue_block_editor_assets', function() use ($block_name, $block_type_name) {

    $block_path = __DIR__ . '/block.js';

    // select reusable blocks
    // Get the current language using Polylang (pll) plugin
    $current_language = function_exists( 'pll_current_language' ) ? pll_current_language() : 'default';

    // Get reusable blocks
    $reusable_blocks = get_posts(
        array(
            'post_type'      => 'wp_block',
            'posts_per_page' => -1,
            'lang'           => $current_language, // Set the current language
        )
    );

    // Create an array to store block IDs and titles
    $block_array = [];

    foreach ( $reusable_blocks as $block ) {
        $block_array[] = [
            'value' => 'popup-id-'.$block->ID,
            'label' => $block->post_title
        ];
    }

    // Convert the PHP array to a JSON object for use in JavaScript
    $block_array_json = json_encode( $block_array );

    $script_contents = file_get_contents( $block_path );

    $inline_script  = '
        (() => {
            const prefix = "' . esc_js( $block_name.'-' ) . '";
            const blockName = "' . esc_js( $block_type_name ) . '";
            const blockArray = ' . $block_array_json . ';
            '.$script_contents.'
        })();
    ';

    wp_register_script( $block_name, '' ); // to use variables without defining globals
    wp_enqueue_script( $block_name );
    wp_add_inline_script( $block_name, $inline_script );

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

add_action( 'wp_enqueue_scripts', function() use ($block_name) {

    $style_path = __DIR__ . '/style.css';
    $style_contents = file_get_contents( $style_path );

    wp_register_style( $block_name, false );
    wp_enqueue_style( $block_name );
    wp_add_inline_style( $block_name, FCGB_DEV ? $style_contents : css_minify( $style_contents ) );

    $script_path = __DIR__ . '/scripts.js';
    $script_contents = file_get_contents( $script_path );

    wp_register_script( $block_name . '-script', false );
    wp_enqueue_script( $block_name . '-script' );
    wp_add_inline_script( $block_name . '-script', js_after_DOM( $script_contents ) );
});

// fetch the reusable blocks' content
add_action( 'rest_api_init', function () {

    register_rest_route( 'fct/popups/v1', '/(?P<ids>[\d\,]+)', [
        'methods'  => 'GET',
        'callback' => function( WP_REST_Request $request ) {

            if ( empty( $request['ids'] ) ) {
                return new WP_REST_Response( [], 200 ); // new \WP_Error( 'nothing_found', 'No ids provided', [ 'status' => 404 ] );
            }

            $wp_query_args = [
                'post_type' => ['wp_block'],
                'post__in' => $request['ids'],
                'post_status' => 'publish',
                'posts_per_page' => 12,
            ];

            $search = new WP_Query( $wp_query_args );

            if ( !$search->have_posts() ) {
                return new WP_REST_Response( [], 200 ); // new \WP_Error( 'nothing_found', 'No results found', [ 'status' => 404 ] );
            }

            $close_labels = ['en' => 'Close', 'de' => 'Schließen'];

            $result = [];
            while ( $search->have_posts() ) {
                $p = $search->next_post();
                $language = function_exists( 'pll_get_post_language' ) ? pll_get_post_language($p->ID) : 'en';
                $close_label = isset( $close_labels[$language] ) ? $close_labels[$language] : $close_labels['en'];
                $result[] = [ 'id' => $p->ID, 'title' => apply_filters( 'the_title', $p->post_title ), 'content' => apply_filters( 'the_content', $p->post_content ), 'close_label' => $close_label ];
            }

            $result = new WP_REST_Response( $result, 200 );

            // nocache_headers();

            return $result;
        },
        'permission_callback' => function() {
            //if ( empty( $_SERVER['HTTP_REFERER'] ) ) { return false; }
            //if ( strtolower( parse_url( $_SERVER['HTTP_REFERER'], PHP_URL_HOST ) ) !== strtolower( $_SERVER['HTTP_HOST'] ) ) { return false; }
            //if ( !current_user_can( 'administrator' ) ) { return false; } // works only with X-WP-Nonce header passed
            return true;
        },
        'args' => [
            'ids' => [
                'description' => 'Reusable blocks post ids',
                'type'        => 'string',
                'required'    => true,
                'validate_callback' => function($param) {
                    return trim( $param ) && strcspn( $param, '0123456789,' ) === 0 ? true : false;
                },
                'sanitize_callback' => function($param, WP_REST_Request $request, $key) {
                    return explode( ',', $param );
                },
            ],
        ],
    ] );
});