import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

export default class Header extends Component {
  render() {
    return (
      <h1>{this.props.title}</h1>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string.isRequired
};
