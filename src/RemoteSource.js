import {TextareaControl, TextControl} from '@wordpress/components';

export default function RemoteSource({featuredVideo, handleUpdate}) {
  return (
      <div>
        <TextControl
            label="Video URL"
            value={featuredVideo.url}
            onChange={(value) => {
              handleUpdate('url', value);
            }}
        />
        <TextareaControl
            label="Caption"
            value={featuredVideo.caption}
            onChange={(value) => {
              handleUpdate('caption', value);
            }}
        />
      </div>
  );
}
