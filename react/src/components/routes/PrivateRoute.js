import React from 'react';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';

export const PrivateRoute = ({ component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps =>
        authed ? (
          React.createElement(component, Object.assign(routeProps, rest))
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: routeProps.location } }}
          />
        )}
    />
  );
};

PrivateRoute.propTypes = {
    component: PropTypes.func,
    user: PropTypes.object,
    authed: PropTypes.object
};