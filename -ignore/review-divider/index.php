<?php

defined( 'ABSPATH' ) || exit;

// FirmCatalyst Plugin Gutenberg Block..
class FCPGBReviewDivider {
    private $name = 'review-divider';

    public function __construct() {
        add_action( 'init', [$this, 'registerBlock'] );
        add_action( 'get_footer', [$this, 'conditionalStyle'] );
    }


    public function registerBlock() {

        register_block_type( 'fcp-gutenberg/'.$this->name, [
            'editor_script' => 'fcpgb-'.$this->name.'-adm',
            'editor_style' => 'fcpgb-'.$this->name.'-adm',
            'render_callback' => [$this, 'printBlock']
        ] );
    
        wp_register_script(
            'fcpgb-'.$this->name.'-adm',
            plugins_url( 'block.js', __FILE__ ),
            ['wp-blocks', 'wp-element', 'wp-editor', 'underscore'],
            filemtime( plugin_dir_path( __FILE__ ) . 'block.js' )
        );
        
        if ( is_file( plugin_dir_path( __FILE__ ) . 'editor.css' ) ) {
            wp_register_style(
                'fcpgb-'.$this->name.'-adm',
                plugins_url( 'editor.css', __FILE__ ),
                ['wp-edit-blocks'],
                filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' )
            );
        }

    }


    public function printBlock($props) {
        ob_start();

?>

<section class="jameda-review-divider">
	<div class="jrd-wrap">
		<div class="jrd-rating"><?php echo $props['rating'] ?></div>
		<div class="jrd-attrs">
			<div class="jrd-date">Jameda Bewertung vom <?php echo $props['date'] ?></div>
			<div class="jrd-title"><?php echo $props['title'] ?></div>
		</div>
		<div class="jrd-content">
            <?php echo $props['content'] ?>
			<p class="jrd-readmore"><a href="<?php echo $props['link'] ?>" target="_blank" rel="noopener noreferrer">Mehr Lesen</a></p>
		</div>
	</div>
</section>

<?php

        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    }


    public function conditionalStyle($content) {

        if ( !is_singular() )
            return $content;

        if ( !has_block( 'fcp-gutenberg/'.$this->name, get_the_ID() ) )
            return $content;

        if ( !is_file( plugin_dir_path( __FILE__ ) . 'style.css' ) )
            return $content;
        
            
        wp_enqueue_style( 'fcpgb-'.$this->name,
            plugins_url( 'style.css', __FILE__ ),
            false,
            filemtime( plugin_dir_path( __FILE__ ) . 'style.css' ),
            'all'
        );

        return $content;
    }
    
}

new FCPGBReviewDivider();
