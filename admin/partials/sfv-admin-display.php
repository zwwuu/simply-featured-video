<?php

/**
 * View for plugin settings page
 *
 * @link       https://zwwuu.dev
 * @since      1.0.0
 *
 * @package    SFV
 * @subpackage SFV/admin/partials
 */
?>

<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}
?>

<?php
if ( isset( $_GET['settings-updated'] ) ) {
	add_settings_error( $this->plugin_name . '_messages', $this->plugin_name . '_messages', __( 'Settings Saved', 'simply-featured-video' ), 'updated' );
}

settings_errors( $this->plugin_name . '_messages' );
?>

<div class="wrap">
    <h2><?php _e( 'Simply Featured Video', 'simply-featured-video' ); ?></h2>
    <form method="post" action="options.php">
		<?php
		settings_fields( $this->plugin_name );
		do_settings_sections( $this->plugin_name );
		?>
		<?php submit_button( __( 'Save', 'simply-featured-video' ) ); ?>
    </form>
	<?php if ( sfv_fs()->is_not_paying() ) : ?>
        <section>
            <h1><?php _e( 'Pro Features','simply-featured-video' ); ?></h1>
            <p><?php _e( 'Custom post type and Page post type available only in Pro', 'simply-featured-video' ); ?></p>
            <a href="<?php echo esc_url( sfv_fs()->get_upgrade_url() ); ?>">
				<?php _e( 'Upgrade Now!', 'simply-featured-video' ); ?>
            </a>
        </section>
	<?php endif; ?>
</div>
