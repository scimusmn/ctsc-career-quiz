import React from 'react';
import PropTypes from 'prop-types';

export default function Media({ media, className = 'max-w-sm mt-2 w-full' }) {
  if (!media || !media.file) {
    console.warn('Media component received invalid media prop');
    return null;
  }

  const mediaType = media.file.contentType.split('/')[0];

  return mediaType === 'image' ? (
    <img src={media.file.url} alt={media.title} className={className} />
  ) : (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video>
      <source
        src={media.file.url}
        type={media.file.contentType}
        className={className}
      />
    </video>
  );
}

Media.propTypes = {
  // eslint-disable-next-line react/require-default-props
  className: PropTypes.string,
  media: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    file: PropTypes.shape({
      contentType: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
