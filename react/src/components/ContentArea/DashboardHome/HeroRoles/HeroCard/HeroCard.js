import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserStatsContainer from '../../../../Stats/UserStatsContainer';
import HeroImage from '../../../../HeroImage/HeroImage';
import Modal from '../../../../Modal/Modal';
import Model from '../../../../../model/model';
import { inviteNotification } from '../../../../Notifications/Notifications';

const classNames = require('classnames');

class HeroCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            invitable: this.isInvitable(props)
        };

        this.isInvitable = this.isInvitable.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.invitePlayer = this.invitePlayer.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            invitable: this.isInvitable(nextProps)
        });
    }

    isInvitable(props) {
        const containsHero = (members, hero) => {
            let result = members.find((member) => {
                return member.platformDisplayName === hero.platformDisplayName;
            });

            if (result) return true;
            return false;
        };


        let isUser = props.hero.platformDisplayName === props.user.platformDisplayName;
        let isMemberOfGroup = containsHero(props.group.members, props.hero);
        let isPendingMemberOfGroup = containsHero(props.group.pending, props.hero);

        return !(isUser || isMemberOfGroup || isPendingMemberOfGroup);
    }

    invitePlayer() {
        inviteNotification(this.props.hero.platformDisplayName);
        Model.inviteUserToGroup({
            platformDisplayName: this.props.hero.platformDisplayName,
            heroName: this.props.hero.heroName
        });
    }

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    render() {
        const classses = classNames({
            overlay: true,
            invitable: this.state.invitable,
        });

        let statLine;

        if(this.props.hero.stats) {
            let wins = this.props.hero.stats.wins || 0;
            let losses = this.props.hero.stats.losses || 0;
            let winPercentage =  (wins + losses) ? parseFloat(wins/(wins+losses) * 100.0).toFixed(1) : 0;

            statLine = (
                <div className="sub-title">
                    <span>{this.props.hero.skillRating} SR</span>
                    <span> | </span><span>{winPercentage}% WR</span>
                </div>
            );
        } else {
            statLine = (
                <div className="sub-title">
                    <span>{this.props.hero.skillRating} SR</span>
                </div>
            );
        }

    return (
        <div className="HeroCard flex align-center">
            <div className="invitePlayerButton">
                <HeroImage heroName={this.props.hero.heroName}/>
                <div className={classses}>
                    <div className="plus-container flex align-center justify-center" onClick={this.invitePlayer}>
                        <i className="fa fa-plus"/>
                    </div>
                </div>
            </div>
            <div className="content flex flex-column">
                <div className="display-name">{this.props.hero.platformDisplayName}</div>
                {statLine}
            </div>
            <div className="button-primary" onClick={this.toggleModal}>
                <div className="button-content">
                    stats
                </div>
            </div>
            <Modal modalOpen={this.state.showModal} closeModal={this.toggleModal}>
                <UserStatsContainer
                    hero={this.props.hero}
                    invitable={this.state.invitable}
                    toggleModal={this.toggleModal}
                />
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
            wins: PropTypes.number,
            losses: PropTypes.number,
        })
    }).isRequired,
    user: PropTypes.shape({
        platformDisplayName: PropTypes.string.isRequired
    })
};

const mapStateToProps = (state) => {
    return {
      group: state.group,
    };
};

export default connect(mapStateToProps)(HeroCard);