<?php

$block_name = FCGB_PREF.basename( __DIR__ ); // ++ can export those to the main index.php
$block_dir_url = get_template_directory_uri() . '/gutenberg/'. basename( __DIR__ );
$block_type_name = FCGB_SLUG.'/'.basename( __DIR__ );

add_action( 'init', function() use ($block_name, $block_dir_url, $block_type_name) {

    $print_block = function($props, $content = null) use ($block_name) {

        $style = [];
        if ( !empty( $props['height'] ) ) { $style['--height'] = strval( $props['height'] ).'px'; }
        if ( !empty( $props['buttonText'] ) ) { $style['--button-text'] = '\''.$props['buttonText'].'\''; }
        if ( !empty( $style ) ) {
            $style_toprint = array_reduce( array_keys( $style ), function($result, $item) use ( $style ) {
                $result .= $item.':'.$style[ $item ].';';
                return $result;
            }, '' );
            $style_toprint = ' style="'.$style_toprint.'"';
        }

        ob_start();

        ?>
            <div class="<?php echo $block_name ?> <?php echo $props['className'] ?? '' ?>"<?php echo $style_toprint ?>>
                <div class="<?php echo $block_name ?>-inner">
                    <?php echo( $content ) ?>
                </div>
                <?php if ( !empty( $props['showButton'] ) ) { ?>
                <button><?php echo $props['buttonText'] ?? '' ?></button>
                <?php } ?>
            </div>
        <?php

        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    };

    register_block_type( $block_type_name, [
        'editor_script' => $block_name,
        'editor_style' => $block_name.'-editor',
        'render_callback' => $print_block
    ] );

    if ( !is_admin() ) { return; }

    $block_path = __DIR__ . '/block.js';
    $script_contents = file_get_contents( $block_path );

    $inline_script  = '
        (() => {
            const prefix = "' . esc_js( $block_name.'-' ) . '";
            const blockName = "' . esc_js( $block_type_name ) . '";
            '.$script_contents.'
        })();
    ';

    wp_register_script( $block_name, '', ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components'] );  // to use variables without defining globals
    wp_enqueue_script( $block_name );
    wp_add_inline_script( $block_name, $inline_script );

    wp_register_style(
        $block_name.'-editor',
        $block_dir_url.'/editor.css',
        ['wp-edit-blocks'],
        FCGB_VER
    );
});

add_action( 'wp_enqueue_scripts', function() use ($block_name, $block_type_name) {

    //if ( !has_block( $block_type_name ) ) { return; } // doesn't work for reusable blocks

    $style_path = __DIR__ . '/style.css';
    $style_contents = file_get_contents( $style_path );

    wp_register_style( $block_name, false );
    wp_enqueue_style( $block_name );
    wp_add_inline_style( $block_name, FCGB_DEV ? $style_contents : css_minify( $style_contents ) );
});