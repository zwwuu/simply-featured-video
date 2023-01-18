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

registerPlugin('plugin-simply-featured-video-panel', {
  render: SimplyFeaturedVideo, icon: null,
});
