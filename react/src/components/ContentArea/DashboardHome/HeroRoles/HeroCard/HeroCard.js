import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserStatsContainer from '../../../../Stats/UserStatsContainer';
import HeroImage from '../../../../HeroImage/HeroImage';
import Modal from '../../../../Modal/Modal';
import Model from '../../../../../model/model';

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
            return members.find((member) => {
                return member.platformDisplayName === hero.platformDisplayName;
            });
        };

        //TODO: proposed change, cant invite people who have invited you
//        const hasInvited = (groupInvites, hero) => {
//            let result = groupInvites.find((invite) => {
//                return invite.leader.platformDisplayName === hero.platformDisplayName;
//            });
//
//            return !!result;
//        }
//        let hasInvitedUserAlready = hasInvited(props.groupInvites, props.hero);


        let leader = props.group.leader;
        let isUserNotInGroup = !leader;
        let isUser = props.user.platformDisplayName === props.hero.platformDisplayName;
        let isMemberOfGroup = containsHero(props.group.members, props.hero);
        let isPendingMemberOfGroup = containsHero(props.group.pending, props.hero);

        return props.invitable && !(isUserNotInGroup || isUser || isMemberOfGroup || isPendingMemberOfGroup );
    }

    invitePlayer() {
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
        //TODO: add TEST
        const displayName = (this.props.hero.platformDisplayName === this.props.user.platformDisplayName)
            ? "You"
            : this.props.hero.platformDisplayName;

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
                <div className="display-name">{displayName}</div>
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

HeroCard.defaultProps = {
    invitable: true
};

HeroCard.propTypes = {
    group: PropTypes.shape({
        leader: PropTypes.object,
        members: PropTypes.array.isRequired,
        pending: PropTypes.array.isRequired,
    }).isRequired,
    user: PropTypes.shape({
        platformDisplayName: PropTypes.string.isRequired
    }).isRequired,
    hero: PropTypes.shape({
        heroName: PropTypes.string.isRequired,
        platformDisplayName: PropTypes.string.isRequired,
        skillRating: PropTypes.number.isRequired,
        stats: PropTypes.shape({
            wins: PropTypes.number,
            losses: PropTypes.number,
        })
    }).isRequired,
    invitable: PropTypes.bool

};

const mapStateToProps = (state) => {
    return {
      group: state.group,
      user: state.user
    };
};

export default connect(mapStateToProps)(HeroCard);