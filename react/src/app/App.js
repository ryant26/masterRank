import React, {
  Component
} from 'react';
import {
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

import PrivateRoute from '../components/Routes/PrivateRoute/PrivateRoute';
import Dashboard from '../pages/Dashboard';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import { home, error } from '../components/Routes/links';

class App extends Component {
    constructor(props) {
        super(props);
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
                <Router>
                    <Switch>
                        <Route
                            path={error}
                             render={(routeProps) => (
                                <ErrorPage {...routeProps} errorMessage={'Error: please try again'} />
                              )}
                        />
                        <PrivateRoute
                            path={home}
                            component={Dashboard}
                            user={this.props.store.user}
                        />
                    </Switch>
                </Router>
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


