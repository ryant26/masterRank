import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

export const PublicRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return React.createElement(component, Object.assign(routeProps, rest));
      }}
    />
  );
};

PublicRoute.propTypes = {
    component: PropTypes.func
};