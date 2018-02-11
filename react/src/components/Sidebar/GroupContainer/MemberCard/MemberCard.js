import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

import Model from '../../../../model/model';
import HeroImage from '../../../HeroImage/HeroImage';
import MemberCardInfo from './MemberCardInfo/MemberCardInfo';

const classNames = require('classnames');

class MemberCard extends Component {

    constructor(props) {
        super(props);
        //TODO: Where should i define the invite time out value? hardcoded here, or pulled out somewhere?
        this.state = {
            timer: null,
            inviteTimeoutSeconds: 30
        };

        this.tick = this.tick.bind(this);
        this.cancelInvite = this.cancelInvite.bind(this);
    }

    componentWillMount() {
        let timer = setInterval(this.tick, 1000);
        this.setState({timer});
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    tick() {
        if(this.state.inviteTimeoutSeconds <= 0) {
            this.cancelInvite();
        } else {
            this.setState({inviteTimeoutSeconds: (this.state.inviteTimeoutSeconds - 1)});
        }
    }

    cancelInvite() {
        Model.cancelInvite({
           platformDisplayName: this.props.member.platformDisplayName,
           heroName: this.props.member.heroName
        });
        clearInterval(this.state.timer);
    }

    render() {

        const classses = classNames({
            overlay: true,
            pending: this.props.pending
        });

        return (
            <div className="MemberCard flex align-center">
                <div className="numberBox flex align-center sidebar-title numbers">{this.props.number}</div>

                <div className="countdownTimer">
                    <HeroImage className="HeroImage" heroName={this.props.member.heroName}/>
                    <div className={classses}>
                        <div className="countdown-container flex align-center justify-center">
                            <div>{this.state.inviteTimeoutSeconds}</div>
                        </div>
                    </div>
                </div>

                <MemberCardInfo
                    platformDisplayName={this.props.member.platformDisplayName}
                    heroName={this.props.member.heroName}
                    pending={this.props.pending}
                    leader={this.props.leader}
                />
            </div>
        );
    }
}

MemberCard.propTypes = {
    member: PropTypes.shape({
        heroName: PropTypes.string.isRequired,
        platformDisplayName: PropTypes.string.isRequired,
        skillRating: PropTypes.number,
        stats: PropTypes.object,
    }).isRequired,
    number: PropTypes.number.isRequired,
    pending: PropTypes.bool,
    leader: PropTypes.bool,
};

export default MemberCard;