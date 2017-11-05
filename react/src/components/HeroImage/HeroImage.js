import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

export default class HeroImage extends Component {

  render() {
    const heroImageStyle = {
      'backgroundColor': 'lightgrey',
      'height': '60px',
      'width': '60px',
      'float': 'left',
    };

    return (
      <img style={heroImageStyle}
        src={require(`../../assets/${this.props.heroName}-icon.png`)}
        alt = {this.props.heroName+' icon'}
      />
    );
  }
}

HeroImage.propTypes = {
  heroName: PropTypes.string.isRequired
};
