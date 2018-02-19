import React, {
  Component
} from 'react';
import {
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import PrivateRoute from '../components/Routes/PrivateRoute/PrivateRoute';
import Dashboard from '../pages/Dashboard/Dashboard';

import { ToastContainer} from 'react-toastify';

import { home } from '../components/Routes/links';
import hotjar from '../utilities/hotjar';

class App extends Component {
    constructor(props) {
        super(props);
        hotjar();
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
                    <Router>
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


