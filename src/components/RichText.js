import React from 'react';
import PropTypes from 'prop-types';
import { renderRichText } from 'gatsby-source-contentful/rich-text';

export default function RichText({ content }) {
  return <>{renderRichText(content, {})}</>;
}

RichText.propTypes = {
  content: PropTypes.instanceOf(Object).isRequired,
};
