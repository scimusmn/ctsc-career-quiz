/* eslint-disable import/prefer-default-export */
// Don't require a default export. Gatsby's API can't support it here.
import PropTypes from 'prop-types';
import './src/styles/index.css';
import React from 'react';
import Layout from './src/components/Layout';

export function wrapRootElement({ element }) {
  return <Layout>{element}</Layout>;
}

wrapRootElement.propTypes = {
  element: PropTypes.element.isRequired,
};
