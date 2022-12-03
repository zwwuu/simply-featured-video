<?php

/**
 * Simply Featured Video Template Functions.
 *
 * @package    SFV
 * @subpackage SFV/includes
 * @author     zwwuu <zwwuu@protonmail.com>
 * @since      1.0.0
 */
/**
 * Retrieves the post video source.
 *
 * @param int|WP_Post $post Optional. Post ID or WP_Post object. Default is global `$post`.
 *
 * @return string|false Post video source (local or remote) or false if the post does not exist.
 *
 * @since 1.0.0
 *
 */
function sfv_get_post_video_source( $post = null )
{
    $post = get_post( $post );
    if ( !$post ) {
        return false;
    }
    $video = get_post_meta( $post->ID, 'sfv_video', true );
    $video = json_decode( $video, true );
    $use_local = false;
    if ( isset( $video['useLocal'] ) ) {
        $use_local = (bool) $video['useLocal'];
    }
    $video_source = ( $use_local ? 'local' : 'remote' );
    /**
     * Filters the post video source.
     *
     * @param string|false $video_source Post video source (local or remote) or false if the post does not exist.
     * @param int|WP_Post|null $post Post ID or WP_Post object. Default is global `$post`.
     *
     * @since 1.0.0
     *
     */
    return apply_filters( 'sfv_post_video_source', $video_source, $post );
}

/**
 * Determines whether a post has a video attached.
 *
 * @param int|WP_Post $post Optional. Post ID or WP_Post object. Default is global `$post`.
 *
 * @return bool Whether the post has a video attached.
 *
 * @since 1.0.0
 *
 */
function sfv_has_post_video( $post = null )
{
    $video_source = sfv_get_post_video_source( $post );
    $has_video = false;
    if ( $video_source == 'local' ) {
        $has_video = (bool) sfv_get_post_video_id( $post );
    }
    if ( $video_source == 'remote' ) {
        $has_video = (bool) sfv_get_the_post_video_url( $post );
    }
    /**
     * Filters whether a post has a post video.
     *
     * @param bool $has_video true if the post has a post video, otherwise false.
     * @param int|WP_Post|null $post Post ID or WP_Post object. Default is global `$post`.
     *
     * @since 1.0.0
     *
     */
    return (bool) apply_filters( 'sfv_has_post_video', $has_video, $post );
}

/**
 * Retrieves the post video ID.
 *
 * @param int|WP_Post $post Optional. Post ID or WP_Post object. Default is global `$post`.
 *
 * @return int|false Post video ID (which can be 0 if the video is not set),
 *                   or false if the post does not exist.
 *
 * @since 1.0.0
 *
 */
function sfv_get_post_video_id( $post = null )
{
    $post = get_post( $post );
    if ( !$post ) {
        return false;
    }
    $video_source = sfv_get_post_video_source( $post );
    $video_id = false;
    
    if ( $video_source == 'local' ) {
        $video = get_post_meta( $post->ID, 'sfv_video', true );
        $video = json_decode( $video, true );
        if ( isset( $video['id'] ) ) {
            $video_id = $video['id'];
        }
    }
    
    /**
     * Filters the post video ID.
     *
     * @param int|false $video_id Post video ID or false if the post does not exist.
     * @param int|WP_Post|null $post Post ID or WP_Post object. Default is global `$post`.
     *
     * @since 1.0.0
     *
     */
    return apply_filters( 'sfv_post_video_id', $video_id, $post );
}

/**
 * Displays the post video.
 *
 * @param string|array $attr Optional. Query string or array of attributes. Default empty.
 *
 * @since 1.0.0
 *
 */
function sfv_the_post_video( $attr = '' )
{
    echo  sfv_get_the_post_video( null, $attr ) ;
}

/**
 * Retrieves the post video.
 *
 * @param int|WP_Post $post Optional. Post ID or WP_Post object.  Default is global `$post`.
 * @param string|array $attr Optional. Query string or array of attributes. Default empty.
 *
 * @return string The post video tag.
 *
 * @since 1.0.0
 *
 */
function sfv_get_the_post_video( $post = null, $attr = '' )
{
    $post = get_post( $post );
    if ( !$post ) {
        return '';
    }
    $video_source = sfv_get_post_video_source( $post );
    $html = '';
    
    if ( $video_source == 'local' ) {
        $post_video_id = sfv_get_post_video_id( $post );
        
        if ( $post_video_id ) {
            /**
             * Fires before fetching the post video HTML.
             *
             * @param int $post_id The post ID.
             * @param int $post_video_id The post video ID.
             *
             * @since 1.0.0
             *
             */
            do_action( 'sfv_begin_fetch_post_video_html', $post->ID, $post_video_id );
            $video_metadata = get_post( $post_video_id );
            $sfv_meta = get_post_meta( $post->ID, 'sfv_video', true );
            $sfv_meta = json_decode( $sfv_meta, true );
            
            if ( $video_metadata && $sfv_meta ) {
                $video_url = wp_get_attachment_url( $post_video_id );
                $video_settings = $sfv_meta['settings'];
                $default_attr = array(
                    'class' => "attachment-video",
                    'alt'   => trim( strip_tags( wp_get_attachment_caption( $post_video_id ) ) ),
                );
                $default_attr = array_merge( $default_attr, $video_settings );
                unset( $default_attr['poster'] );
                $default_attr = array_filter( $default_attr, function ( $value ) {
                    return $value == true;
                } );
                $attr = wp_parse_args( $attr, $default_attr );
                $attr_string = '';
                foreach ( $attr as $name => $value ) {
                    
                    if ( $name == 'poster' ) {
                        $attr_string .= ' poster="' . esc_url( $value ) . '"';
                    } else {
                        $attr_string .= " {$name}=" . '"' . esc_attr( $value ) . '"';
                    }
                
                }
                $html = rtrim( "<video " . $attr_string ) . '>';
                $html .= '<source src="' . esc_url( $video_url ) . '" type="' . esc_attr( $video_metadata->post_mime_type ) . '">';
                $html .= __( 'Your browser does not support the video tag.', 'simply-featured-video' );
                $html .= '</video>';
            }
            
            /**
             * Fires after fetching the post video HTML.
             *
             * @param int $post_id The post ID.
             * @param int $post_video_id The post video ID.
             *
             * @since 1.0.0
             *
             */
            do_action( 'sfv_end_fetch_post_video_html', $post->ID, $post_video_id );
        }
    
    }
    
    
    if ( $video_source == 'remote' ) {
        $video_url = sfv_get_the_post_video_url( $post );
        if ( $video_url ) {
            $html = wp_oembed_get( $video_url );
        }
    }
    
    /**
     * Filters the post video HTML.
     *
     * @param string $html The post video HTML.
     * @param int $post_id The post ID.
     * @param int $post_video_id The post video ID, or 0 if there isn't one.
     *
     * @param string|array $attr Query string or array of attributes.
     *
     * @since 1.0.0
     *
     */
    return apply_filters(
        'sfv_post_video_html',
        $html,
        $post->ID,
        $attr
    );
}

/**
 * Displays the post video URL.
 *
 * @since 1.0.0
 *
 */
function sfv_the_post_video_url( $post = null )
{
    $url = sfv_get_the_post_video_url( $post );
    if ( $url ) {
        echo  esc_url( $url ) ;
    }
}

/**
 * Returns the post video URL.
 *
 * @param int|WP_Post $post Optional. Post ID or WP_Post object.  Default is global `$post`.
 *
 * @return string|false Post video URL or false if no video is available.
 *
 * @since 1.0.0
 *
 */
function sfv_get_the_post_video_url( $post = null )
{
    $video_source = sfv_get_post_video_source( $post );
    $video_url = '';
    if ( !$video_source ) {
        return false;
    }
    
    if ( $video_source == 'local' ) {
        $post_video_id = sfv_get_post_video_id( $post );
        if ( $post_video_id ) {
            $video_url = wp_get_attachment_url( $post_video_id );
        }
    }
    
    
    if ( $video_source == 'remote' ) {
        $post = get_post( $post );
        
        if ( $post ) {
            $video = get_post_meta( $post->ID, 'sfv_video', true );
            $video = json_decode( $video, true );
            if ( isset( $video['url'] ) ) {
                $video_url = $video['url'];
            }
        }
    
    }
    
    /**
     * Filters the post video URL.
     *
     * @param string|false $video_url Post video URL or false if the post does not exist.
     * @param int|WP_Post|null $post Post ID or WP_Post object. Default is global `$post`.
     *
     * @since 1.0.0
     *
     */
    return apply_filters( 'sfv_post_video_url', $video_url, $post );
}

/**
 * Displays the post video caption.
 *
 * @param int|WP_Post $post Optional. Post ID or WP_Post object. Default is global `$post`.
 *
 * @since 1.0.0
 *
 */
function sfv_the_post_video_caption( $post = null )
{
    $video_caption = sfv_get_the_post_video_caption( $post );
    echo  esc_html( $video_caption ) ;
}

/**
 * Returns the post video caption.
 *
 * @param int|WP_Post $post Optional. Post ID or WP_Post object. Default is global `$post`.
 *
 * @return string Post video caption.
 * @since 1.0.0
 *
 */
function sfv_get_the_post_video_caption( $post = null )
{
    $video_source = sfv_get_post_video_source( $post );
    $caption = '';
    
    if ( $video_source == 'local' ) {
        $post_video_id = sfv_get_post_video_id( $post );
        if ( $post_video_id && wp_get_attachment_caption( $post_video_id ) ) {
            $caption = wp_get_attachment_caption( $post_video_id );
        }
    }
    
    
    if ( $video_source == 'remote' ) {
        $post = get_post( $post );
        
        if ( $post ) {
            $video = get_post_meta( $post->ID, 'sfv_video', true );
            $video = json_decode( $video, true );
            if ( isset( $video['caption'] ) ) {
                $caption = $video['caption'];
            }
        }
    
    }
    
    /**
     * Filters the displayed post video caption.
     *
     * @param string $caption Caption for the video.
     *
     * @since 1.0.0
     *
     */
    return apply_filters( 'sfv_post_video_caption', $caption );
}
