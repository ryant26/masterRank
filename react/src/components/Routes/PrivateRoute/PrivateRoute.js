import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Authentication from 'components/Login/Authentication/Authentication';

const PrivateRoute = ({ component, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps =>
        user ? (
          React.createElement(component, Object.assign(routeProps, rest))
        ) : (
          <Authentication />
        )}
    />
  );
};

PrivateRoute.propTypes = {
    component: PropTypes.func,
    user: PropTypes.object
};

export default PrivateRoute;