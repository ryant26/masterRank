import React, {
  Component
} from 'react';
import {
    Router,
    Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import PrivateRoute from '../components/Routes/PrivateRoute/PrivateRoute';
import Dashboard from '../pages/Dashboard/Dashboard';
import history from '../model/history';

import { ToastContainer} from 'react-toastify';

import { home } from '../components/Routes/links';
import hotjar from '../utilities/hotjar';
import Raven from 'raven-js';


class App extends Component {
    constructor(props) {
        super(props);
        hotjar();
        Raven.config('https://c816514ee6b14f959907ee6da946e782@sentry.io/294177').install()
    }

    render() {
        return (
            <div className="App flex stretch">
                <Helmet
                    link={[
                        {
                            rel: 'stylesheet',
                            href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
                        }
                    ]}
                />
                <ErrorBoundary>
                    <ToastContainer className="NotificationsContainer"/>
                    <Router history={history}>
                        <Switch>
                            <PrivateRoute
                                path={home}
                                component={Dashboard}
                                user={this.props.store.user}
                            />
                        </Switch>
                    </Router>
                </ErrorBoundary>
            </div>
        );
    }
}

App.propTypes = {
    store: PropTypes.object,
    user: PropTypes.object,
    region: PropTypes.string,
};

const mapStateToProps = function(state){
  return {
    store: state,
  };
};

export default connect(mapStateToProps)(App);


