<?php
$print_function = function(array $props, string $content): void {
    global $fc_gutenberg_blocks_tabs_id, $fc_gutenberg_blocks_tabs_collected;
?>

<section class="fc-tabs" role="tablist">
    <?php echo $content ?>
    <nav>
        <?php foreach ($fc_gutenberg_blocks_tabs_collected as $tab_id => $label) { ?>
            <label for="<?php echo $tab_id ?>"><?php echo esc_html($label) ?></label>
        <?php } ?>
    </nav>
</section>

<?php 
    $fc_gutenberg_blocks_tabs_id = '';
    $fc_gutenberg_blocks_tabs_collected = [];
};
?>
