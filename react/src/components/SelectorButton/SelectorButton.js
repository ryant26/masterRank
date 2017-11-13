import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import HeroImage from '../HeroImage/HeroImage';

export default class SelectorButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      backgroundColor: 'lightgrey',
    };

    this.addCards = this.addCards.bind(this);
  }

  addCards() {
    this.setState(prevState => (
      prevState.isSelected
      ? {
          isSelected: false,
          backgroundColor: 'lightgrey'
      }
      : {
          isSelected: true,
          backgroundColor: '#33CC00'
      }
    ));
  }

  render() {

    const selectorStyle = {
      'backgroundColor': this.state.backgroundColor,
      'padding': '5px',
      'margin': '10px',
    };

    return (
      <div style={selectorStyle} onClick={this.addCards}>
        <HeroImage heroName={this.props.heroName}/>
      </div>
    );
  }
}

SelectorButton.propTypes = {
  heroName: PropTypes.string.isRequired
};