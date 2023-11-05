<?php

defined( 'ABSPATH' ) || exit;

// FirmCatalyst Plugin Gutenberg Block..
class FCPSurgeries {
    private $name = 'surgeries';

    public function __construct() {
        add_action( 'init', [$this, 'registerBlock'] );
        add_action( 'wp_enqueue_scripts', [$this, 'conditionalStyle'] );
    }


    public function registerBlock() {

        fc-reis-info-box-main( 'fcp-gutenberg/'.$this->name, [
            'editor_script' => 'fcpgb-'.$this->name.'-adm',
            'editor_style' => 'fcpgb-'.$this->name.'-adm',
            'render_callback' => [$this, 'printBlock']
        ] );
    
        wp_register_script(
            'fcpgb-'.$this->name.'-adm',
            plugins_url( 'block.js', __FILE__ ),
            ['wp-blocks', 'wp-element', 'wp-block-editor', 'underscore'],
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


    public function printBlock($props, $content = null) {
        ob_start();

?>

    <div class="fcp-surg-tile">

        <?php if ( !empty( $props['title'] ) ) { ?>
        <h2 class="fcp-surg-tile-title">
            <?php echo $props['title'] ?>
        </h2>
        <?php } ?>
        
        <?php if ( !empty( $content ) ) { ?>
        <div class="fcp-surg-tile-content">
            <?php echo $content ?>
        </div>
        <?php } ?>
        
        <?php if ( !empty( $props['link'] ) ) { ?>
        <a href="<?php echo $props['link'] ?>" class="fcp-surg-tile-link">
            Mehr Erfahren
        </a>
        <?php } ?>

    </div>

<?php

        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    }

    public function conditionalStyle($content) {

        if ( !has_block( 'fcp-gutenberg/'.$this->name, get_the_ID() ) ) {
            return $content;
        }

        if ( !is_file( plugin_dir_path( __FILE__ ) . 'style.css' ) ) {
            return $content;
        }
        
            
        wp_enqueue_style( 'fcpgb-'.$this->name,
            plugins_url( 'style.css', __FILE__ ),
            false,
            filemtime( plugin_dir_path( __FILE__ ) . 'style.css' ),
            'all'
        );

        return $content;
    }
    
}

new FCPSurgeries();
