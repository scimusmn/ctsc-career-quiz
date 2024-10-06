/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

export default function Media({ media, className = 'w-full' }) {
  if (!media) {
    console.warn('Media component received invalid media prop');
    return null;
  }

  // Check if we are dealing with a Gatsby-optimized image (gatsbyImageData) or a raw file (e.g., video or SVG)
  const isGatsbyImage = media.gatsbyImageData;

  // Handle Gatsby-optimized images
  if (isGatsbyImage) {
    const imageData = getImage(media); // Get optimized image
    return (
      <GatsbyImage
        image={imageData}
        alt={media.title || 'Media'}
        className={className}
      />
    );
  }

  // Handle SVGs separately, as they can be rendered directly in an <img> tag or embedded inline
  if (media.file && media.file.contentType === 'image/svg+xml') {
    return <img src={media.file.url} alt={media.title} className={className} />;
  }

  // Fallback to handling video files or other media types with raw file URLs
  if (media.file && media.file.contentType.startsWith('video')) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video className={className} muted autoPlay loop>
        <source src={media.file.url} type={media.file.contentType} />
      </video>
    );
  }

  console.warn('Unsupported media type');
  return null;
}

Media.propTypes = {
  className: PropTypes.string,
  media: PropTypes.shape({
    title: PropTypes.string,
    gatsbyImageData: PropTypes.object,
    file: PropTypes.shape({
      contentType: PropTypes.string,
      url: PropTypes.string,
    }),
  }).isRequired,
};
