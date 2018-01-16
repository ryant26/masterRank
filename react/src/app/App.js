import React, {
  Component
} from 'react';
import {
    BrowserRouter as Router,
    Switch
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { PrivateRoute, PublicRoute } from '../routes/routes';
import Dashboard from '../containers/Dashboard';
import LoginPage from '../containers/LoginPage';
import {updateUser as updateUserAction} from "../actions/user";

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <PublicRoute
                      exact
                      path='/login'
                      component={LoginPage}
                      updateUserAction={this.props.updateUserAction}
                    />
                    <PrivateRoute
                      path="/"
                      component={Dashboard}
                      authed={this.props.store.user}
                      user={this.props.store.user}
                      dispatch={this.props.dispatch}
                    />

                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = function(state){
  return {
    store: state,
  }
}

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    updateUserAction: updateUserAction,
    dispatch: dispatch,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
