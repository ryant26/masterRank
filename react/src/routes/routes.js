import React from 'react';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router'

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return React.createElement(component, finalProps)
}

export const PublicRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest)
      }}
    />
  )
}

export const PrivateRoute = ({ component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps =>
        authed ? (
          renderMergedProps(component, routeProps, rest)
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: routeProps.location } }}
          />
        )}
    />
  )
}