<?php $print_function = function($props) { ?>
<?php

    $ids = array_map( 'trim', explode( ',', $props['ids'] ) );
    $short_titles = [];

    $menus = wp_get_nav_menus();
    foreach ($menus as $menu) {
        $menu_items = wp_get_nav_menu_items($menu->term_id);
        foreach ($menu_items as $menu_item) {
            $short_titles[$menu_item->object_id] = $menu_item->title;
        }
    }
    
?>
<section class="post-tiles alignwide <?php echo $props['className'] ?>">
<?php foreach ($ids as $id): ?>
    <?php if ($post = get_post($id)): ?>
        <div>
            <a href="<?php echo get_permalink($post) ?>" class="post-tile-image">
                <?php if (has_post_thumbnail($post)): ?>
                    <?php echo get_the_post_thumbnail($post, 'large') ?>
                <?php endif ?>
            </a>
            <div class="post-tile-content">
                <h3><a href="<?php echo get_permalink($post) ?>"><?php echo esc_html($short_titles[$id] ?: get_the_title($post)) ?></a></h3>
                <div class="post-tile-excerpt"><?php echo get_the_excerpt($post) ?></div>
            </div>
        </div>
    <?php endif ?>
<?php endforeach ?>
</section>
<pre>
    <?php print_r( $ids ) ?>
</pre>
<?php };