import {useDispatch, useSelect} from '@wordpress/data';
import {registerPlugin} from '@wordpress/plugins';
import {PluginDocumentSettingPanel} from '@wordpress/edit-post';
import {__} from '@wordpress/i18n';
import {ToggleControl, ExternalLink} from '@wordpress/components';
import {PostTypeSupportCheck} from '@wordpress/editor';
import {useState} from '@wordpress/element';
import {set} from 'lodash';

import RemoteSource from './RemoteSource';
import LocalSource from './LocalSource';
import './index.css';

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

const SimplyFeaturedVideo = () => {
  const featuredVideo = useSelect((select) => {
    const video = select('core/editor').getEditedPostAttribute('meta')['sfv_video'];
    try {
      const data = JSON.parse(video);
      return {...defaultVideo, ...data};
    } catch {
      return defaultVideo;
    }
  }, []);
  const [video, setVideo] = useState(featuredVideo);
  const {editPost} = useDispatch('core/editor');
  const handleUpdate = (path, value) => {
    const data = set(featuredVideo, path, value);
    editPost({meta: {sfv_video: JSON.stringify(data)}});
    setVideo(data);
    console.log(`${path}: ${value}`);
  };

  return (
      <PostTypeSupportCheck supportKeys="custom-fields">
        <PluginDocumentSettingPanel title={__('Featured video')}>
          <div className="editor-simply-featured-video">
            <ToggleControl
                label={__('Use media library')}
                help={featuredVideo.useLocal ?
                    (__('Set video source from media library.')
                    ) : (
                        <>
                          {`${__('Set video source from url.')} `}
                          <ExternalLink
                              href="https://wordpress.org/support/article/embeds/#okay-so-what-sites-can-i-embed-from">
                            {__('See supported video provider.')}
                          </ExternalLink>
                        </>
                    )
                }
                checked={featuredVideo.useLocal}
                onChange={(value) => {
                  handleUpdate('useLocal', value);
                }}
            />
            {featuredVideo.useLocal ? (
                <>
                  <LocalSource featuredVideo={video} handleUpdate={handleUpdate}/>
                </>
            ) : (
                <RemoteSource featuredVideo={video} handleUpdate={handleUpdate}/>
            )}
          </div>
        </PluginDocumentSettingPanel>
      </PostTypeSupportCheck>
  );
};

// const applyWithSelect = withSelect((select) => {
//     const {getMedia} = select('core');
//     const {getEditedPostAttribute} = select('core/editor');
//     const postMeta = getEditedPostAttribute('meta');
//
//     try {
//         const featuredVideo = JSON.parse(postMeta.sfv_video);
//         if (isObject(featuredVideo)) {
//             return {
//                 featuredVideo,
//                 media: getMedia(featuredVideo.id),
//                 useLocalVideo: featuredVideo.useLocal,
//             };
//         }
//         return {
//             featuredVideo: defaultVideo,
//             media: null,
//             useLocalVideo: defaultVideo.useLocal,
//         };
//     } catch (e) {
//         return {
//             featuredVideo: defaultVideo,
//             media: null,
//             useLocalVideo: defaultVideo.useLocal,
//         };
//     }
// });
//
// const applyWithDispatch = withDispatch(
//     (dispatch, {noticeOperations}, {select}) => {
//         const {editPost} = dispatch('core/editor');
//         const {getEditedPostAttribute} = select('core/editor');
//         const postMeta = getEditedPostAttribute('meta');
//         let featuredVideo = {};
//
//         try {
//             featuredVideo = JSON.parse(postMeta.sfv_video);
//         } catch (e) {
//             featuredVideo = defaultVideo;
//         }
//
//         return {
//             onUpdateMeta: (path, value) => {
//                 featuredVideo = set(featuredVideo, path, value);
//                 editPost({
//                     meta: {sfv_video: JSON.stringify(featuredVideo)},
//                 });
//             },
//             onDropVideo(filesList) {
//                 select('core/block-editor')
//                     .getSettings()
//                     .mediaUpload({
//                         allowedTypes: ALLOWED_MEDIA_TYPES,
//                         filesList,
//                         onFileChange([video]) {
//                             featuredVideo.id = video.id;
//                             editPost({
//                                 meta: {
//                                     sfv_video: JSON.stringify(featuredVideo),
//                                 },
//                             });
//                         },
//                         onError(message) {
//                             noticeOperations.removeAllNotices();
//                             noticeOperations.createErrorNotice(message);
//                         },
//                     });
//             },
//             onRemoveVideo() {
//                 editPost({
//                     meta: {sfv_video: JSON.stringify(defaultVideo)},
//                 });
//             },
//         };
//     }
// );

registerPlugin('plugin-simply-featured-video-panel', {
  render: SimplyFeaturedVideo, icon: null,
});
