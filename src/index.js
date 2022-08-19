import { withDispatch, withSelect } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import {
	DropZone,
	Button,
	Spinner,
	ResponsiveWrapper,
	ToggleControl,
	SelectControl,
	TextControl,
	ExternalLink,
	TextareaControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PostTypeSupportCheck } from '@wordpress/editor';
import { isNil, isObject, set } from 'lodash';

import './index.css';

const ALLOWED_MEDIA_TYPES = [ 'video' ];
const options = [
	{ value: 'auto', label: __( 'Auto' ) },
	{ value: 'metadata', label: __( 'Metadata' ) },
	{ value: 'none', label: __( 'None' ) },
];
const defaultVideo = {
	useLocal: false,
	id: 0,
	url: '',
	caption: '',
	useFeaturedImageAsPoster: false,
	settings: {
		autoplay: false,
		loop: false,
		muted: false,
		controls: true,
		playsInline: false,
		preload: 'auto',
		poster: '',
	},
};
const isPremium = sfvEditorData[ 'isPremium' ] ?? false;

const SimplyFeaturedVideo = ( {
	featuredVideo,
	onUpdateMeta,
	onDropVideo,
	onRemoveVideo,
	media,
	noticeUI,
	useLocalVideo,
} ) => {
	return (
		<PostTypeSupportCheck supportKeys="custom-fields">
			<PluginDocumentSettingPanel title={ __( 'Featured video' ) }>
				{ noticeUI }
				<div className="editor-simply-featured-video">
					<ToggleControl
						label={ __( 'Use media library' ) }
						help={
							useLocalVideo ? (
								__( 'Set video source from media library.' )
							) : (
								<>
									{ `${ __(
										'Set Video source from url.'
									) } ` }
									<ExternalLink href="https://wordpress.org/support/article/embeds/#okay-so-what-sites-can-i-embed-from">
										{ __(
											'See supported video provider.'
										) }
									</ExternalLink>
								</>
							)
						}
						onChange={ ( value ) => {
							onUpdateMeta( 'useLocal', value );
						} }
						checked={ featuredVideo.useLocal }
					/>
					{ useLocalVideo ? (
						<MediaUploadCheck
							fallback={
								<p>
									{ __(
										'To edit the featured video, you need permission to upload media.'
									) }
								</p>
							}
						>
							<MediaUpload
								title={ __( 'Featured video' ) }
								onSelect={ ( selectedMedia ) =>
									onUpdateMeta( 'id', selectedMedia.id )
								}
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								value={ featuredVideo }
								render={ ( { open } ) => (
									<div className="editor-simply-featured-video__container">
										{ featuredVideo.id === 0 && (
											<div
												className={
													'editor-simply-featured-video__dropzone'
												}
											>
												<Button
													onClick={ open }
													className={
														'editor-simply-featured-video__toggle'
													}
												>
													{ __(
														'Set featured video'
													) }
												</Button>
												<DropZone
													onFilesDrop={ onDropVideo }
												/>
											</div>
										) }
										{ featuredVideo.id > 0 &&
											isNil( media ) && (
												<div
													className={
														'editor-simply-featured-video__dropzone'
													}
												>
													<Spinner />
													<DropZone
														onFilesDrop={
															onDropVideo
														}
													/>
												</div>
											) }
										{ featuredVideo.id > 0 &&
											! isNil( media ) && (
												<>
													<div
														className={
															'editor-simply-featured-video__dropzone'
														}
													>
														<ResponsiveWrapper
															naturalWidth={
																media
																	.media_details
																	.width
															}
															naturalHeight={
																media
																	.media_details
																	.height
															}
															isInline
														>
															<video
																controls={
																	true
																}
															>
																<source
																	src={
																		media.source_url
																	}
																	type={
																		media.mime_type
																	}
																/>
															</video>
														</ResponsiveWrapper>
														<DropZone
															onFilesDrop={
																onDropVideo
															}
														/>
													</div>
													<Button
														onClick={ open }
														isSecondary
													>
														{ __(
															'Replace video'
														) }
													</Button>
													<Button
														isDestructive
														onClick={
															onRemoveVideo
														}
													>
														{ __( 'Remove video' ) }
													</Button>
													{ isPremium ? (
														<ToggleControl
															label={ __(
																'Use featured image as poster'
															) }
															onChange={ (
																value
															) => {
																onUpdateMeta(
																	'useFeaturedImageAsPoster',
																	value
																);
															} }
															checked={
																featuredVideo.useFeaturedImageAsPoster
															}
														/>
													) : (
														<>
															<p>
																{ __(
																	'Poster setting is only available in Pro.'
																) }
															</p>
														</>
													) }
													<ToggleControl
														label={ __(
															'Autoplay'
														) }
														onChange={ (
															value
														) => {
															onUpdateMeta(
																'settings.autoplay',
																value
															);
														} }
														checked={
															featuredVideo
																.settings
																.autoplay
														}
													/>
													<ToggleControl
														label={ __( 'Loop' ) }
														onChange={ (
															value
														) => {
															onUpdateMeta(
																'settings.loop',
																value
															);
														} }
														checked={
															featuredVideo
																.settings.loop
														}
													/>
													<ToggleControl
														label={ __( 'Muted' ) }
														onChange={ (
															value
														) => {
															onUpdateMeta(
																'settings.muted',
																value
															);
														} }
														checked={
															featuredVideo
																.settings.muted
														}
													/>
													<ToggleControl
														label={ __(
															'Playback controls'
														) }
														onChange={ (
															value
														) => {
															onUpdateMeta(
																'settings.controls',
																value
															);
														} }
														checked={
															featuredVideo
																.settings
																.controls
														}
													/>
													<ToggleControl
														label={ __(
															'Play inline'
														) }
														onChange={ (
															value
														) => {
															onUpdateMeta(
																'settings.playsInline',
																value
															);
														} }
														checked={
															featuredVideo
																.settings
																.playsInline
														}
													/>
													<SelectControl
														label={ __(
															'Preload'
														) }
														value={
															featuredVideo
																.settings
																.preload
														}
														onChange={ (
															value
														) => {
															onUpdateMeta(
																'settings.preload',
																value
															);
														} }
														options={ options }
														hideCancelButton={
															true
														}
													/>
												</>
											) }
									</div>
								) }
							/>
						</MediaUploadCheck>
					) : (
						<div>
							<TextControl
								label="Video URL"
								value={ featuredVideo.url }
								onChange={ ( value ) =>
									onUpdateMeta( 'url', value )
								}
							/>
							<TextareaControl
								label="Caption"
								value={ featuredVideo.caption }
								onChange={ ( value ) =>
									onUpdateMeta( 'caption', value )
								}
							/>
						</div>
					) }
				</div>
			</PluginDocumentSettingPanel>
		</PostTypeSupportCheck>
	);
};
const applyWithSelect = withSelect( ( select ) => {
	const { getMedia } = select( 'core' );
	const { getEditedPostAttribute } = select( 'core/editor' );
	const postMeta = getEditedPostAttribute( 'meta' );

	try {
		const featuredVideo = JSON.parse( postMeta.sfv_video );
		if ( isObject( featuredVideo ) ) {
			return {
				featuredVideo,
				media: getMedia( featuredVideo.id ),
				useLocalVideo: featuredVideo.useLocal,
			};
		}
		return {
			featuredVideo: defaultVideo,
			media: null,
			useLocalVideo: defaultVideo.useLocal,
		};
	} catch ( e ) {
		return {
			featuredVideo: defaultVideo,
			media: null,
			useLocalVideo: defaultVideo.useLocal,
		};
	}
} );

const applyWithDispatch = withDispatch(
	( dispatch, { noticeOperations }, { select } ) => {
		const { editPost } = dispatch( 'core/editor' );
		const { getEditedPostAttribute } = select( 'core/editor' );
		const postMeta = getEditedPostAttribute( 'meta' );
		let featuredVideo = {};

		try {
			featuredVideo = JSON.parse( postMeta.sfv_video );
		} catch ( e ) {
			featuredVideo = defaultVideo;
		}

		return {
			onUpdateMeta: ( path, value ) => {
				featuredVideo = set( featuredVideo, path, value );
				editPost( {
					meta: { sfv_video: JSON.stringify( featuredVideo ) },
				} );
			},
			onDropVideo( filesList ) {
				select( 'core/block-editor' )
					.getSettings()
					.mediaUpload( {
						allowedTypes: ALLOWED_MEDIA_TYPES,
						filesList,
						onFileChange( [ video ] ) {
							featuredVideo.id = video.id;
							editPost( {
								meta: {
									sfv_video: JSON.stringify( featuredVideo ),
								},
							} );
						},
						onError( message ) {
							noticeOperations.removeAllNotices();
							noticeOperations.createErrorNotice( message );
						},
					} );
			},
			onRemoveVideo() {
				editPost( {
					meta: { sfv_video: JSON.stringify( defaultVideo ) },
				} );
			},
		};
	}
);

registerPlugin( 'plugin-simply-featured-video-panel', {
	render: compose(
		applyWithSelect,
		applyWithDispatch
	)( SimplyFeaturedVideo ),
	icon: null,
} );
