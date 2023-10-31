<?php

$hide_on_start = true; // ++make it into a global option somehow for these blocks

add_action( 'init', function() use ( $block_name, $hide_on_start ) {

    $print_block = function( $props, $content = null ) use ( $block_name, $hide_on_start ) {

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
            <div class="fcp-<?php echo $block_name ?><?php echo $hide_on_start ? ' fcp-'.$block_name.'_hidden' : '' ?> <?php echo esc_attr( $props['className'] ) ?>"<?php echo $style ?>>
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
            <?php echo !empty( $props['moreinfo'] ) ? '<div class="fcp-tile-team-member-moreinfo">'.str_replace( "\n", '<br>', $props['moreinfo'] ).'</div>' : '' ?>
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

// styling
add_action( 'wp_enqueue_scripts', function() use ( $block_name ) {

    if ( !has_block( 'fcp-gutenberg/' . $block_name ) ) { return; }

    wp_enqueue_style( 'fcp-' . $block_name,
        plugins_url( 'style.css', __FILE__ ),
        false,
        filemtime( plugin_dir_path( __FILE__ ) . 'style.css' ),
        'all'
    );
});

// first screen styling
add_action( 'wp_enqueue_scripts', function() use ( $block_name ) {

    if ( !has_block( 'fcp-gutenberg/' . $block_name ) ) { return; }

    wp_register_style( 'fcp-'.$block_name.'-fs', false );
    wp_enqueue_style( 'fcp-'.$block_name.'-fs' );
    wp_add_inline_style( 'fcp-'.$block_name.'-fs', ( function() {
        ob_start(); //++ add this construction to a separate function and add namespaces to the plugin
        @include_once ( __DIR__ . '/style-fs.css' );
        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    })() );
}, 7 );


// appearing effect
add_action( 'wp_enqueue_scripts', function() use ( $block_name, $hide_on_start ) {

    if ( !has_block( 'fcp-gutenberg/' . $block_name ) ) { return; }
    if ( !$hide_on_start ) { return; }

    // hide the blocks on the start if js is on
    wp_register_script( 'fcp-'.$block_name.'-fs-hide', '' );
    wp_enqueue_script( 'fcp-'.$block_name.'-fs-hide' );
    wp_add_inline_script( 'fcp-'.$block_name.'-fs-hide', ( function() {
        ob_start();
        @include_once ( __DIR__ . '/scripts-hide.js' );
        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    })());

    // ++the following can probably be loaded as tags
    // show the blocks on..
    wp_register_script( 'fcp-'.$block_name.'-fs-show', '', ['fcp-gutenberg-assets-fconvisibledo1'] );
    wp_enqueue_script( 'fcp-'.$block_name.'-fs-show' );
    wp_add_inline_script( 'fcp-'.$block_name.'-fs-show', ( function() {
        ob_start();
        @include_once ( __DIR__ . '/scripts-show.js' );
        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    })());

    // load from assets: on-the-screen listener
    wp_register_script( 'fcp-gutenberg-assets-fconvisibledo1', '' );
    wp_enqueue_script( 'fcp-gutenberg-assets-fconvisibledo1' );
    wp_add_inline_script( 'fcp-gutenberg-assets-fconvisibledo1', ( function() {
        ob_start();
        @include_once ( __DIR__ . '/../assets/fcOnVisibleDo1.min.js' ); // ++minify
        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    })());

}, 7 );
// ++minify all the inlines
// ++separate dev version and production