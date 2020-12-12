import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import './stylesheets/loadable.scss';

const Loadable = (props) => (
  <div className="loadable">
    {props.loaded
      ? props.children : (
        <Loader
          type="Rings"
          color="#01693E"
          height={100}
          width={100}
        />
      )}
  </div>
);

Loadable.propTypes = {
  loaded: PropTypes.bool.isRequired,
};

export default Loadable;
