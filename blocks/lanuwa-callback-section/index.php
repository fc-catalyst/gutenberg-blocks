<?php $print_function = function($props) { ?>
    <div class="alignwide <?php echo $props['className'] ?>">
    <?php include(locate_template('template-parts/callback-section.php')); ?>
    </div>
<?php };