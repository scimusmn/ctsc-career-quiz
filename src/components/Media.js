import React from 'react';
import PropTypes from 'prop-types';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

export default function Media({ media, className = 'w-full' }) {
  if (!media?.localFile?.extension) {
    console.warn('Media component received invalid or unsupported media prop');
    return null;
  }

  const { extension, publicURL } = media.localFile;
  const { title } = media;

  // Determine media type based on file extension
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].includes(
    extension.toLowerCase()
  );
  const isSvg = extension.toLowerCase() === 'svg';
  const isVideo = ['mp4', 'webm', 'ogg'].includes(extension.toLowerCase());

  // Render Gatsby-optimized images from localFile
  if (isImage) {
    const imageData = getImage(media.localFile); // Pass localFile directly
    if (imageData) {
      return (
        <GatsbyImage
          image={imageData}
          alt={title || 'Media'}
          className={className}
        />
      );
    }
  }

  // Render SVGs directly
  if (isSvg) {
    return (
      <img src={publicURL} alt={title || 'SVG Image'} className={className} />
    );
  }

  // Render video files
  if (isVideo) {
    return (
      <video className={className} muted autoPlay loop>
        <source src={publicURL} type={`video/${extension}`} />
      </video>
    );
  }

  console.warn('Unsupported media type or missing data');
  return null;
}

Media.propTypes = {
  className: PropTypes.string.isRequired,
  media: PropTypes.object.isRequired,
};
