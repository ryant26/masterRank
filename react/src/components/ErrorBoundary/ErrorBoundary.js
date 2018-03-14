import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

import { clearLocalStorage } from '../../utilities/localStorage/localStorageUtilities';
import {home} from "../Routes/links";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorInfo: null
        };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });
        //TODO: add error reporting service
    }

    clearStateAndReload() {
        clearLocalStorage();
        window.location.assign(home);
    }

    render() {
        if (this.state.errorInfo) {
            return (
                <div className="ErrorBoundary">
                    <h2>Something went wrong.</h2>
                    <details style={{whiteSpace: 'pre-wrap'}}>
                        {this.state.error && this.state.error.toString()}
                        <br/>
                        {this.state.errorInfo.componentStack}
                    </details>
                    <br/>
                    <ul>
                        <li><h2>Possible Resolutions:<br/></h2></li>
                        <li><h3>1. Refresh the page</h3></li>
                        <li><h3>2. Use the button below to clear your local state and reload the page</h3></li>
                    </ul>
                    <button onClick={this.clearStateAndReload}>
                        Clear State and Reload
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node
};

export default ErrorBoundary;
