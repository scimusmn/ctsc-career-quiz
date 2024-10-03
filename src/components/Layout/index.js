import React from 'react';
import PropTypes from 'prop-types';

export default function Layout({ children }) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
};
