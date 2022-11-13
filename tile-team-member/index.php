<?php

add_action( 'init', function() use ( $block_name ) {

    $print_block = function( $props, $content = null ) use ( $block_name ) {

        $tag = empty( $props['url'] ) ? ['div'] : [
                'a',
                'href="'.esc_attr( $props['url'] ).'"',
                'title="'.esc_attr( $props['name'] ).'"'
        ];

        $style = '';
        if ( !empty( $props['height'] ) || !empty( $props['mainColor'] ) || !empty( $props['subColor'] ) ) {
            $style .= ' style="'
                .( !empty( $props['height'] ) ? '--height:'.$props['height'].'%;' : '' )
                .( !empty( $props['mainColor'] ) ? '--color-main:'.$props['mainColor'].';' : '' )
                .( !empty( $props['subColor'] ) ? '--color-sub:'.$props['subColor'].';' : '' )
                .'"';
        }

        ob_start();

        ?>
        <div>
            <div class="fcp-<?php echo $block_name ?>"<?php echo $style ?>>
                <<?php echo implode( ' ' , $tag ) ?> class="fcp-<?php echo $block_name ?>-link">
                    <div class="fcp-<?php echo $block_name ?>-content"><?php
                        echo !empty( $props['name'] ) ? '<span>'.$props['name'].'</span>' : '';
                        echo !empty( $props['description'] ) ? '<p>'.$props['description'].'</p>' : '';
                    ?></div>
                </<?php echo $tag[0] ?>>
                <div class="fcp-<?php echo $block_name ?>-image">
                    <?php echo wp_get_attachment_image( $props['mediaID'], !empty( $props['mediaSize'] ) ? $props['mediaSize'] : '' ) ?>
                </div>
            </div>
        </div>
        <?php

        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    };

    register_block_type( 'fcp-gutenberg/' . $block_name, [
        'editor_script' => 'fcp-' . $block_name . '-block',
        'editor_style' => 'fcp-' . $block_name . '-editor',
        'render_callback' => $print_block
    ] );

    if ( !is_admin() ) { return; }

    wp_register_script(
        'fcp-' . $block_name . '-block',
        plugins_url( 'block.js', __FILE__ ),
        ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components'],
        filemtime( plugin_dir_path( __FILE__ ) . 'block.js' )
    );

    wp_register_style(
        'fcp-' . $block_name . '-editor',
        plugins_url( 'editor.css', __FILE__ ),
        ['wp-edit-blocks'],
        filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' )
    );
});

add_action( 'wp_enqueue_scripts', function() use ( $block_name ) { // ++add first screen option

    if ( !has_block( 'fcp-gutenberg/' . $block_name ) ) { return; }

    wp_enqueue_style( 'fcp-' . $block_name,
        plugins_url( 'style.css', __FILE__ ),
        false,
        filemtime( plugin_dir_path( __FILE__ ) . 'style.css' ),
        'all'
    );

    // appearing effect
    wp_register_script( 'fcp-gutenberg-assets-fconvisibledo', '' );
    wp_enqueue_script( 'fcp-gutenberg-assets-fconvisibledo' );
    wp_add_inline_script( 'fcp-gutenberg-assets-fconvisibledo', ( function() {
        ob_start();
        @include_once ( __DIR__ . '/../--assets/fcOnVisibleDo.js' );
        @include_once ( __DIR__ . '/scripts.js' );
        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    })());

});
