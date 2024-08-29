<?php $print_function = function($props, $content) { ?>
<style>
    .home-hero-image {
        --backgroundImage: url('<?php echo $props['images'][0]['url'] ?? '' ?>');
    }
</style>
<section class="section-content home-hero-section alignfull">
    <div class="home-hero-image" style="background: var(--backgroundImage) no-repeat center center;"></div>
    <div class="home-hero-container container">
        <div class="col-md-6 col-md-offset-6">
            <div class="content">
                <?php echo $content ?>
            </div>
        </div>
    </div>
</section>
<?php };