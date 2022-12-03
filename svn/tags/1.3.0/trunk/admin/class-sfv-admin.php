<?php

/**
 * Defines the plugin name, version, and hooks
 *
 * @package    SFV
 * @subpackage SFV/admin
 * @author     zwwuu <zwwuu@protonmail.com>
 */
class SFV_Admin
{
    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $plugin_name The ID of this plugin.
     */
    private  $plugin_name ;
    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $version The current version of this plugin.
     */
    private  $version ;
    /**
     * Initialize the class and set its properties.
     *
     * @param string $plugin_name The name of this plugin.
     * @param string $version The version of this plugin.
     *
     * @since    1.0.0
     */
    public function __construct( $plugin_name, $version )
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }
    
    /**
     * Register the assets for the block editor.
     *
     * @since    1.0.0
     */
    public function enqueue_block_assets()
    {
        $options = get_option( 'sfv_options' );
        
        if ( isset( $options['post_types'] ) && !empty($options['post_types']) ) {
            $post_types = $options['post_types'];
            $current_post_type = get_post_type();
            
            if ( in_array( $current_post_type, $post_types ) ) {
                wp_enqueue_style(
                    $this->plugin_name,
                    plugins_url( 'build/index.css', __DIR__ ),
                    array(),
                    $this->version,
                    'all'
                );
                $asset_file = (include plugin_dir_path( __DIR__ ) . 'build/index.asset.php');
                wp_enqueue_script(
                    $this->plugin_name,
                    plugin_dir_url( __DIR__ ) . 'build/index.js',
                    $asset_file['dependencies'],
                    $asset_file['version'],
                    false
                );
                wp_add_inline_script( $this->plugin_name, 'const ' . $this->plugin_name . 'EditorData= ' . json_encode( array(
                    'isPremium' => sfv_fs()->can_use_premium_code(),
                ) ), 'before' );
            }
        
        }
    
    }
    
    public function create_featured_video_post_meta()
    {
        $options = get_option( 'sfv_options' );
        
        if ( isset( $options['post_types'] ) && !empty($options['post_types']) ) {
            $post_types = $options['post_types'];
            foreach ( $post_types as $post_type ) {
                register_post_meta( $post_type, 'sfv_video', array(
                    'type'         => 'string',
                    'single'       => true,
                    'show_in_rest' => true,
                ) );
            }
        }
    
    }
    
    /**
     * Register the administration menu for this plugin into the WordPress Dashboard menu.
     *
     * @since    1.0.0
     */
    public function add_plugin_admin_menu()
    {
        add_menu_page(
            __( 'Simply Featured Video', 'simply-featured-video' ),
            __( 'Simply Featured Video', 'simply-featured-video' ),
            'manage_options',
            $this->plugin_name,
            array( $this, 'display_plugin_option_page' )
        );
    }
    
    /**
     * Add settings action link to the plugins page.
     *
     * @since    1.0.0
     */
    public function add_action_links( $links )
    {
        $settings_link = array( '<a href="' . admin_url( 'admin.php?page=' . $this->plugin_name ) . '">' . __( 'Settings', 'simply-featured-video' ) . '</a>' );
        return array_merge( $settings_link, $links );
    }
    
    /**
     * Register the custom settings.
     *
     * @since    1.0.0
     */
    public function add_plugin_options()
    {
        register_setting( $this->plugin_name, $this->plugin_name . '_options' );
        add_settings_section(
            $this->plugin_name . '_general_section',
            __( 'General', 'simply-featured-video' ),
            array( $this, 'display_general_section' ),
            $this->plugin_name
        );
        add_settings_field(
            $this->plugin_name . '_post_types',
            __( 'Select the post types', 'simply-featured-video' ),
            array( $this, 'display_post_types_field' ),
            $this->plugin_name,
            $this->plugin_name . '_general_section'
        );
    }
    
    /**
     * Render the general setting section.
     *
     * @since    1.0.0
     */
    function display_general_section()
    {
        echo  '<p>' . __( 'Select the post types where you want to enable featured video.', 'simply-featured-video' ) . '</p>' ;
    }
    
    /**
     * Render the post type field in general setting section.
     *
     * @since    1.0.0
     */
    function display_post_types_field()
    {
        $options = get_option( $this->plugin_name . '_options' );
        $value = array();
        if ( isset( $options['post_types'] ) && !empty($options['post_types']) ) {
            $value = $options['post_types'];
        }
        $post_obj = get_post_type_object( 'post' );
        ?>

        <label>
            <input type="checkbox"
                   id="<?php 
        esc_attr_e( $this->plugin_name . '_options[post_types][' . $post_obj->name . ']' );
        ?>"
                   name="<?php 
        esc_attr_e( $this->plugin_name . '_options[post_types][]' );
        ?>"
                   value="<?php 
        esc_attr_e( $post_obj->name );
        ?>"
				<?php 
        esc_attr_e( ( in_array( $post_obj->name, $value ) ? 'checked' : '' ) );
        ?>
            />
			<?php 
        esc_html_e( $post_obj->label );
        ?>
        </label>
        <br/>

		<?php 
    }
    
    /**
     * Render the settings page for this plugin.
     *
     * @since    1.0.0
     */
    public function display_plugin_option_page()
    {
        if ( !current_user_can( 'manage_options' ) ) {
            return;
        }
        include_once 'partials/sfv-admin-display.php';
    }

}