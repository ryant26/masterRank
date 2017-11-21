import React, { Component } from 'react';
import HeroList from './HeroList';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class PreferredHerosContainer extends Component {
  render() {
    const { heroes = [] } = this.props;

    return (
      <HeroList heroes={heroes}/>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    heroes: state.preferredHeroes
  };
};



PreferredHerosContainer.propTypes = {
  heroes: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(PreferredHerosContainer);