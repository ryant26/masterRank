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
        onClick={this.props.onClick}
      />
    );
  }
}

HeroImage.propTypes = {
    heroName: PropTypes.string.isRequired,
    onClick: PropTypes.func
};
