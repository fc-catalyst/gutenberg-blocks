<?php
$print_function = function(array $props, string $content): void {
    global $fc_gutenberg_blocks_tabs_id, $fc_gutenberg_blocks_tabs_collected;

    if ( empty($props['tabLabel']) && !$content ) {
        return;
    }
    if ( empty($props['tabLabel']) ) {
        $props['tabLabel'] = '-----';
    }

    $first = !$fc_gutenberg_blocks_tabs_id;
    $fc_gutenberg_blocks_tabs_id = $fc_gutenberg_blocks_tabs_id ?: substr(uniqid(), -6);
    $fc_gutenberg_blocks_tabs_collected = $fc_gutenberg_blocks_tabs_collected ?? [];

    $tabs_id = 'tabs' . $fc_gutenberg_blocks_tabs_id;
    $tab_id = 'tab' . $fc_gutenberg_blocks_tabs_id . count($fc_gutenberg_blocks_tabs_collected);

    $fc_gutenberg_blocks_tabs_collected[$tab_id] = $props['tabLabel'];
?>

    <input
        type="radio"
        name="<?php echo $tabs_id ?>"
        class="sr-only"
        id="<?php echo $tab_id ?>"
        <?php echo $first ? 'checked' : '' ?>
        role="tab"
        aria-labelledby="label<?php echo $tab_id ?>"
    >
    <label
        id="label<?php echo $tab_id ?>"
        for="<?php echo $tab_id ?>"
    >
        <?php echo esc_html($props['tabLabel']) ?>
    </label>
    <div>
        <?php echo $content ?>
    </div>

<?php };
?>
