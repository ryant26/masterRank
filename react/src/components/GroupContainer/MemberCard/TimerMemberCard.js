import React, {
    Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Model from '../../../model/model';
import HeroImage from '../../HeroImage/HeroImage';

const classNames = require('classnames');

class TimerMemberCard extends Component {

    constructor(props) {
        super(props);
        //TODO: unhardcode counter
        this.state = {
            timer: null,
            inviteTimeoutSeconds: 5
        }

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
        }

        this.setState({inviteTimeoutSeconds: (this.state.inviteTimeoutSeconds - 1)});
    }

    cancelInvite() {
        alert(`${this.props.member.heroName}`);
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
            <div className="GroupHeroCard flex align-center">
                <div className="numberBox flex align-center sidebar-title numbers">{this.props.number}</div>

                <div className="countdownTimer">
                    <HeroImage className="HeroImage" heroName={this.props.member.heroName}/>
                    <div className={classses}>
                        <div className="countdown-container flex align-center justify-center">
                            <div>{this.state.inviteTimeoutSeconds}</div>
                        </div>
                    </div>
                </div>

                <div className="imageStylePadding">
                    <div className="flex justify-between">
                        {this.props.member.platformDisplayName}
                    </div>
                    <div className="inLine1">
                        <div>{this.props.member.heroName}</div>
                    </div>
                </div>
            </div>
        );
    }
};

TimerMemberCard.propTypes = {
    member: PropTypes.shape({
        heroName: PropTypes.string.isRequired,
        platformDisplayName: PropTypes.string.isRequired,
        skillRating: PropTypes.number,
        stats: PropTypes.object,
    }).isRequired
};

export default TimerMemberCard;