<?php

/**
 * The plugin bootstrap file
 *
 * @link              zwwuu.dev
 * @since             1.0.0
 * @package           SFV
 *
 * @wordpress-plugin
 * Plugin Name:       Simply Featured Video
 * Plugin URI:        sfv.zwwuu.dev
 * Description:       Simply Featured Video allows you to set a featured video from media library, YouTube, Vimeo, and more.
 * Version:           1.1.0
 * Author:            zwwuu
 * Author URI:        zwwuu.dev
 * License:           GPL-3.0
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       simply-featured-video
 * Domain Path:       /languages
 */
// If this file is called directly, abort.
if ( !defined( 'WPINC' ) ) {
    die;
}
/**
 * Current plugin version.
 */
define( 'SFV_VERSION', '1.1.0' );

if ( function_exists( 'sfv_fs' ) ) {
    sfv_fs()->set_basename( false, __FILE__ );
} else {
    
    if ( !function_exists( 'sfv_fs' ) ) {
        // Create a helper function for easy SDK access.
        function sfv_fs()
        {
            global  $sfv_fs ;
            
            if ( !isset( $sfv_fs ) ) {
                // Include Freemius SDK.
                require_once dirname( __FILE__ ) . '/freemius/start.php';
                $sfv_fs = fs_dynamic_init( array(
                    'id'             => '10879',
                    'slug'           => 'simply-featured-video',
                    'type'           => 'plugin',
                    'public_key'     => 'pk_87a416bafd741653444d6bd31ddd2',
                    'is_premium'     => false,
                    'premium_suffix' => 'Pro',
                    'has_addons'     => false,
                    'has_paid_plans' => true,
                    'menu'           => array(
                    'slug' => 'sfv',
                ),
                    'is_live'        => true,
                ) );
            }
            
            return $sfv_fs;
        }
        
        // Init Freemius.
        sfv_fs();
        // Signal that SDK was initiated.
        do_action( 'sfv_fs_loaded' );
    }
    
    register_activation_hook( __FILE__, 'activate_sfv' );
    register_deactivation_hook( __FILE__, 'deactivate_sfv' );
    /**
     * The core plugin class that is used to define internationalization,
     * admin-specific hooks, and public-facing site hooks.
     */
    require plugin_dir_path( __FILE__ ) . 'includes/class-sfv.php';
    /**
     * Begins execution of the plugin.
     *
     * @since    1.0.0
     */
    function run_sfv()
    {
        $plugin = new SFV();
        $plugin->run();
    }
    
    run_sfv();
}

/**
 * The code that runs during plugin activation.
 */
function activate_sfv()
{
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-sfv-activator.php';
    SFV_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_sfv()
{
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-sfv-deactivator.php';
    SFV_Deactivator::deactivate();
}
