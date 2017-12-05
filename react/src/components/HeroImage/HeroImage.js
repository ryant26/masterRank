import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

export default class HeroImage extends Component {

  render() {
    return (
      <img className="HeroImage"
        src={require(`../../assets/${this.props.heroName}-icon.png`)}
        alt = {this.props.heroName+' icon'}
      />
    );
  }
}

HeroImage.propTypes = {
  heroName: PropTypes.string.isRequired
};
