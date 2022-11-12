<?php

add_action( 'init', function() use ( $block_name ) {

    $print_block = function( $props, $content = null ) use ( $block_name ) {
        ob_start();

        ?>
        <div class="fcp-tile-brief">
            <div class="fcp-tile-brief-icon">
                <?php echo wp_get_attachment_image( $props['mediaID'], 'full' ) ?>
            </div>
            <div class="fcp-tile-brief-header">
                <?php echo !empty( $props['headlinePre'] ) ? '<div class="fcp-tile-brief-preheadlilne">'.$props['headlinePre'].'</div>' : '' ?>
                <?php echo !empty( $props['headline'] ) ? '<h2>'.$props['headline'].'</h2>' : '' ?>
            </div>
            <?php echo( $content ) ?>
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
});
