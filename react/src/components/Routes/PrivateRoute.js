import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Authentication from '../Authentication/Authentication';

export const PrivateRoute = ({ component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps =>
        authed ? (
          React.createElement(component, Object.assign(routeProps, rest))
        ) : (
          <Authentication />
        )}
    />
  );
};

PrivateRoute.propTypes = {
    component: PropTypes.func,
    user: PropTypes.object,
    authed: PropTypes.object
};