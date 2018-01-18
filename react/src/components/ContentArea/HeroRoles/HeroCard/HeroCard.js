import React, {
  Component
} from 'react';

import HeroCardStats from '../HeroCardStats/HeroCardStats';
import HeroImage from '../../../HeroImage/HeroImage';
import PropTypes from 'prop-types';
import Modal from '../../../Modal/Modal';
const classNames = require('classnames');


export default class HeroCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
        isStatsToggleOn: false,
        modalOpen: false
    };

    this.toggleStats = this.toggleStats.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  toggleStats() {
    this.setState(prevState => ({
      isStatsToggleOn: !prevState.isStatsToggleOn
    }));
  }

    openModal() {
        this.setState(() => {
            return {
                modalOpen: true
            };
        });
    }

    closeModal() {
        this.setState(() => {
            return {
                modalOpen: false
            };
        });
    }

  render() {
      const classses = classNames({
          overlay: true,
          invitable: this.props.hero.platformDisplayName !== this.props.user.platformDisplayName
      });

      let statLine;

      if(this.props.hero.stats) {
          let wins = this.props.hero.stats.wins;
          let losses = this.props.hero.stats.losses;
          let winPercentage = parseFloat(wins/(wins+losses) * 100.0).toFixed(1);
            statLine = (
                <div className="sub-title">
                    <span>{this.props.hero.skillRating} SR</span>
                    <span> | </span><span>{winPercentage}% WR</span>
                </div>
            );
      }


    return (
        <div className="HeroCard flex align-center">
            <div className="invitePlayerButton">
              <HeroImage heroName={this.props.hero.heroName}/>
              <div className={classses}>
                <div className="plus-container flex align-center justify-center">
                  <i className="fa fa-plus"/>
                </div>
              </div>
            </div>
            <div className="content flex flex-column">
                <div className="display-name">{this.props.hero.platformDisplayName}</div>
                {statLine}
            </div>
            <div className="button-primary" onClick={this.openModal}>
                <div className="button-content">
                    stats
                </div>
            </div>
            <Modal modalOpen={this.state.modalOpen} closeModal={this.closeModal}>
                <HeroCardStats hero={this.props.hero}/>
            </Modal>

        </div>
    );
  }
}

HeroCard.propTypes = {
    hero: PropTypes.shape({
        heroName: PropTypes.string.isRequired,
        platformDisplayName: PropTypes.string.isRequired,
        skillRating: PropTypes.number.isRequired,
        stats: PropTypes.shape({
            wins: PropTypes.number.isRequired,
            losses: PropTypes.number.isRequired,
        })
    }),
    user: PropTypes.shape({
        platformDisplayName: PropTypes.string.isRequired
    })
};