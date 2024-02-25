<?php

add_action( 'init', function() use ( $block_name ) {

    $print_block = function( $props, $content = null ) use ( $block_name ) {
        if ( empty( $props['attr'] ) && empty( $props['valu'] ) ) { return; }
        ob_start();

        ?>
        <div class="fcp-tile-brief-content">
            <?php echo !empty( $props['attr'] ) ? '<span>'.$props['attr'].'</span>' : '' ?>
            <span class="fcp-tile-brief-divider"></span>
            <?php echo !empty( $props['valu'] ) ? '<span>'.$props['valu'].'</span>' : '' ?>
        </div>
        <?php

        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    };

    fc-reis-info-box-main( 'fcp-gutenberg/' . $block_name, [
        'editor_script' => 'fcp-' . $block_name . '-block',
        'render_callback' => $print_block
    ] );

    if ( !is_admin() ) { return; }
    
    wp_register_script(
        'fcp-' . $block_name . '-block',
        plugins_url( 'block.js', __FILE__ ),
        ['wp-blocks', 'wp-element', 'wp-components'],
        filemtime( plugin_dir_path( __FILE__ ) . 'block.js' )
    );

});
