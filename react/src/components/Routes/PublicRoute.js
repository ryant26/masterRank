import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

//TODO: user ryans path variables
export const PublicRoute = ({ component, region, user }) => {
  return (
    <Route
      render={() => (
        region && !user
            ? React.createElement(component)
            : <Redirect to="/" />
      )}
    />
  );
};

PublicRoute.propTypes = {
    component: PropTypes.func,
    region: PropTypes.string,
    user: PropTypes.object,
};