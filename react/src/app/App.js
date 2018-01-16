import React, {
  Component
} from 'react';
import {
    BrowserRouter as Router,
    Switch
} from 'react-router-dom';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { PrivateRoute, PublicRoute } from '../routes/routes';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
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
                          path='/login'
                          component={LoginPage}
                        />
                        <PrivateRoute
                          path="/"
                          component={Dashboard}
                          authed={this.props.store.user}
                          user={this.props.store.user}
                        />

                    </Switch>
                </Router>
            </div>
        );
    }
}

const mapStateToProps = function(state){
  return {
    store: state,
  }
}

export default connect(mapStateToProps)(App)


