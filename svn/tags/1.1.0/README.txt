=== Simply Featured Video - Featured video support for WordPress ===
Contributors: zwwuu
Tags: video plugin, video embed, video, featured video, YouTube, Vimeo
Requires at least: 5.8
Tested up to: 6.0
Stable tag: 1.1.0
License: GPL-3.0 license or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Simply Featured Video allows you to set a featured video from media library, YouTube, Vimeo, and more.

== Description ==
Simply Featured Video is a featured video plugin that allow tou to import video from media library or third party video platform into your WordPress post and embed the video automatically.

The featured video can be place anywhere in your post content where you want the video to be displayed.

**Classic editor not supported**

**Features**

* WordPress featured video
* Support media library and third party video platform
* Embed video automatically
* Block editor support

**Theme compatibility**

Simply Featured Video is compatible with any WP theme that follows the coding standards.

== Installation ==
1. Upload the plugin files to the `/wp-content/plugins/` directory, or install the plugin through the WordPress plugins screen directly;
2. Activate the plugin through the 'Plugins' screen in WordPress;
3. Config the plugin in the Simply Featured Video screen.
4. Add featured video to your post.
5. Place `<?php sfv_the_post_video(); ?>` to your theme's post template file.

== Screenshots ==

1. Enabling post type support for featured video in the plugin settings.
2. Using YouTube video as featured video.
3. Using video from media library as featured video.
4. Viewing a post with YouTube video as featured video.
5. Viewing a post with video from media library as featured video.

== Frequently Asked Questions ==

= Will this plugin work with classic editor? =
Currently there is no support for classic editor.

= Why is there no featured video box for [xyz] post type? =
You need to go to the Simply Featured Video setting page and check the post type that you need featured video support.

= What PHP functions can I use?=
`
sfv_get_post_video_source( $post )
sfv_has_post_video( $post )
sfv_get_post_video_id( $post )
sfv_the_post_video( $attr )
sfv_get_the_post_video( $post, $attr )
sfv_the_post_video_url( $post )
sfv_get_the_post_video_url( $post )
sfv_the_post_video_caption( $post )
sfv_get_the_post_video_caption( $post )
`

All parameters are optional. If no $post is given the current post’s ID will be used.
$attr is either a string or an array representing <video> HTML element attributes, e.g. array('loop'=> true).

== Changelog ==

= 1.1.0 =
Fix error on plugin deactivate.
Add instructions in setting page.

= 1.0.0 =

Initial release.
