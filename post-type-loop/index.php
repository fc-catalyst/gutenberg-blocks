<?php

add_action( 'init', function() use ( $block_name ) {

    $print_block = function( $props, $content = null ) use ( $block_name ) {

        ob_start();

        ?>
        <div class="fcp-post-type-loop">
            <?php
                if ( $link = get_next_post_link( '%link', '%title' ) ) {
                    echo $link;
                } else {
                    $link = new WP_Query('posts_per_page=1&post_type='.get_post_type().'&order=ASC');
                    $link->the_post();
                    echo '<a href="' . get_permalink() . '">' . get_the_title() . '</a>';
                    wp_reset_postdata();
                }
                unset( $link );
            ?>
            <?php
                if ( $link = get_previous_post_link( '%link', '%title' ) ) {
                    echo $link;
                } else {
                    $link = new WP_Query('posts_per_page=1&post_type='.get_post_type().'&order=DESC');
                    $link->the_post();
                    echo '<a href="' . get_permalink() . '">' . get_the_title() . '</a>';
                    wp_reset_postdata();
                }
                unset( $link );
            ?>
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

});