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
    <h2><?php _e( 'How to use?', 'simply-featured-video' ); ?></h2>
    <p><?php _e( "Include <code>sfv_get_the_post_video()</code> in your theme template file.", 'simply-featured-video' ); ?></p>
    <h3><?php _e( "All available functions", 'simply-featured-video' ); ?></h3>
    <ul>
        <li><code>sfv_get_post_video_source( $post )</code></li>
        <li><code>sfv_has_post_video( $post )</code></li>
        <li><code>sfv_get_post_video_id( $post )</code></li>
        <li><code>sfv_the_post_video( $attr )</code></li>
        <li><code>sfv_get_the_post_video( $post, $attr )</code></li>
        <li><code>sfv_the_post_video_url( $post )</code></li>
        <li><code>sfv_get_the_post_video_url( $post )</code></li>
        <li><code>sfv_the_post_video_caption( $post )</code></li>
        <li><code>sfv_get_the_post_video_caption( $post )</code></li>
    </ul>
    <p><?php _e( "All parameters are optional. If no <code>\$post</code> is given the current post's ID will be used.", 'simply-featured-video' ); ?></p>
    <p><?php _e( "<code>\$attr</code> is either a string or an array representing HTML element attributes, e.g. <code>array('loop'=> true)</code>.", 'simply-featured-video' ); ?>    </p>
    <a class="button" href="https://zwwuu.github.io/simply-featured-video/">
		<?php _e( "Read Documentation", 'simply-featured-video' ); ?>
    </a>

	<?php if ( sfv_fs()->is_not_paying() ) : ?>
        <section>
            <h1><?php _e( 'Pro Features', 'simply-featured-video' ); ?></h1>
            <p><?php _e( 'Custom post type and Page post type available only in Pro', 'simply-featured-video' ); ?></p>
            <a href="<?php echo esc_url( sfv_fs()->get_upgrade_url() ); ?>">
				<?php _e( 'Upgrade Now!', 'simply-featured-video' ); ?>
            </a>
        </section>
	<?php endif; ?>
</div>
