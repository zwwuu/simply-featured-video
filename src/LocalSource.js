import {MediaUpload, MediaUploadCheck} from '@wordpress/block-editor';
import {__} from '@wordpress/i18n';
import {Button, DropZone, SelectControl, Spinner, ToggleControl} from '@wordpress/components';
import {useSelect} from '@wordpress/data';

const ALLOWED_MEDIA_TYPES = ['video'];
const options = [
  {value: 'auto', label: __('Auto')},
  {value: 'metadata', label: __('Metadata')},
  {value: 'none', label: __('None')},
];

export default function LocalSource({featuredVideo, handleUpdate}) {
  const isPremium = sfvEditorData['isPremium'] ?? false;

  const media = useSelect(select => {
    const {getMedia} = select('core');
    if (featuredVideo.id > 0) {
      return getMedia(featuredVideo.id);
    }

    return null;
  }, [featuredVideo]);

  const onDropVideo = (filesList) => {
    select('core/block-editor').getSettings().mediaUpload({
      allowedTypes: ALLOWED_MEDIA_TYPES,
      filesList,
      onFileChange([video]) {
        handleUpdate('id', video.id);
      },
    });
  };

  return (
      <MediaUploadCheck
          fallback={<p>{__('To edit the featured video, you need permission to upload media.')}</p>}>
        <MediaUpload
            title={__('Featured video')}
            onSelect={(selectedMedia) => {
              console.log(selectedMedia);
              handleUpdate('id', selectedMedia.id);
            }}
            allowedTypes={ALLOWED_MEDIA_TYPES}
            value={featuredVideo}
            render={({open}) => (
                <div className="editor-simply-featured-video__container">
                  {featuredVideo.id === 0 && (
                      <div className={'editor-simply-featured-video__dropzone'}>
                        <Button onClick={open} className={'editor-simply-featured-video__toggle'}>
                          {__('Set featured video')}
                        </Button>
                        <DropZone onFilesDrop={onDropVideo}/>
                      </div>
                  )}
                  {featuredVideo.id > 0 && !media && (
                      <>
                        <div className={'editor-simply-featured-video__dropzone'}>
                          <Spinner/>
                          <DropZone onFilesDrop={onDropVideo}/>
                        </div>
                        <Button onClick={open} isSecondary>
                          {__('Replace video')}
                        </Button>
                        <Button isDestructive onClick={() => {
                          handleUpdate('id', 0);
                        }}>
                          {__('Remove video')}
                        </Button>
                      </>
                  )}
                  {featuredVideo.id > 0 && media && (
                      <>
                        <div>
                          <video controls={true}>
                            <source src={media.source_url} type={media.mime_type}/>
                          </video>
                        </div>
                        <Button onClick={open} isSecondary>
                          {__('Replace video')}
                        </Button>
                        <Button isDestructive onClick={() => {
                          handleUpdate( 'id', 0);
                        }}>
                          {__('Remove video')}
                        </Button>
                        {isPremium ? (
                            <ToggleControl
                                label={__('Use featured image as poster')}
                                checked={featuredVideo.useFeaturedImageAsPoster}
                                onChange={(value) => {
                                  handleUpdate('settings.useFeaturedImageAsPoster', value);
                                }}
                            />
                        ) : (
                            <p>{__('Poster setting is only available in Pro.')}</p>
                        )}
                        <ToggleControl
                            label={__('Autoplay')}
                            checked={featuredVideo.settings.autoplay}
                            onChange={(value) => {
                              handleUpdate('settings.autoplay', value);
                            }}
                        />
                        <ToggleControl
                            label={__('Loop')}
                            checked={featuredVideo.settings.loop}
                            onChange={(value) => {
                              handleUpdate('settings.loop', value);
                            }}
                        />
                        <ToggleControl
                            label={__('Muted')}
                            checked={featuredVideo.settings.muted}
                            onChange={(value) => {
                              handleUpdate('settings.muted', value);
                            }}
                        />
                        <ToggleControl
                            label={__('Playback controls')}
                            checked={featuredVideo.settings.controls}
                            onChange={(value) => {
                              handleUpdate('settings.controls', value);
                            }}
                        />
                        <ToggleControl
                            label={__('Play inline')}
                            checked={featuredVideo.settings.playsInline}
                            onChange={(value) => {
                              handleUpdate('settings.playsInline', value);
                            }}
                        />
                        <SelectControl
                            label={__('Preload')}
                            value={featuredVideo.settings.preload}
                            onChange={(value) => {
                              handleUpdate('settings.preload', value);
                            }}
                            options={options}
                            hideCancelButton={true}
                        />
                      </>
                  )}
                </div>
            )}
        />
      </MediaUploadCheck>
  );
}
