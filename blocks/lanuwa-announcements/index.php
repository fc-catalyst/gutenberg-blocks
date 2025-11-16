<?php $print_function = function($props) { ?>
<?php

$args = array(
    'post_type' => 'announcement',
    'showposts' => 1,
    'paged' => 1
);
$custom_query = new WP_Query( $args );
if( $custom_query->have_posts() ):
    while( $custom_query->have_posts() ): $custom_query->the_post();

?>

<section class="section-2-col announcement-section alignwide <?php echo $props['className'] ?>">
    <div class="container">
        <div class="row row-eq-height">
            <div class="col-xs-12 col-sm-4">
            <?php
                $thumb = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'large' ); 
                $thumb_url = !empty($thumb[0]) ? $thumb[0] : get_bloginfo('stylesheet_directory').'/images/share/default-image-new.jpg';
            ?> 
                <img src="<?php echo $thumb_url ?>">
            </div>
            <div class="col-xs-12 col-sm-8">
                <h2><?php echo str_replace( '//', '', get_the_title() ) ?></h2>
                <p><?php echo str_replace( '[&hellip;]', '&hellip;', get_the_excerpt() ) ?></p>
                <p><a href="<?php the_permalink() ?>" class="btn btn-brand btn-lg has-base-color">Mehr erfahren</a></p>
            </div>
        </div>
    </div>
</section>

<?php
    endwhile;
endif;
?>
<?php };