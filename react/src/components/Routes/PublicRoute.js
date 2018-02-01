import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export const PublicRoute = ({ component, region }) => {
  return (
    <Route
      render={() => (
        region
            ? React.createElement(component)
            : <Redirect to='/' />
      )}
    />
  );
};

PublicRoute.propTypes = {
    component: PropTypes.func
};