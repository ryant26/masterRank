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

import { PrivateRoute } from '../components/Routes/PrivateRoute';
import { PublicRoute } from '../components/Routes/PublicRoute';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage/LoginPage';

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
                        <PublicRoute
                            exact
                            path="/login"
                            component={LoginPage}
                            region={this.props.store.region}
                            user={this.props.store.user}
                        />
                        <PrivateRoute
                            path="/"
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


