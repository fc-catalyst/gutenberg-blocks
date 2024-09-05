<?php $print_function = function($props, $content) { ?>
<section class="section-content home-hero-section alignfull">
    <div class="home-hero-image" style="--backgroundImage:url('<?php echo $props['images'][0]['url'] ?? '' ?>')"></div>
    <div class="home-hero-container container">
        <div class="col-md-6 col-md-offset-6">
            <div class="content">
                <?php echo $content ?>
            </div>
        </div>
    </div>
</section>
<?php };