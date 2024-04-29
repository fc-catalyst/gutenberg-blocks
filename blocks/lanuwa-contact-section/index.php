<?php $print_function = function($props) { ?>
    <div class="alignfull <?php echo $props['className'] ?>">
    <?php include(locate_template('template-parts/contact-section.php')); ?>
    </div>
<?php };