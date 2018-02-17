import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo:null
    };
  }

  componentDidCatch(error, errorInfo) {
     this.setState({
       error,
       errorInfo
     });
    //TODO: add error reporting service
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div className="ErrorBoundary">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
    children: PropTypes.element
};

export default ErrorBoundary;