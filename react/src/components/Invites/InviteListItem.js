import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class InviteListItem extends Component{

  constructor(props) {
    super(props);
    this.state = {
      minutesOldString: this.calculateMinutesOldString(props.details.inviteDate)
    };
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState((prevState, props) => {
        return {
          minutesOldString: this.calculateMinutesOldString(props.details.inviteDate)
        };
      });
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  calculateMinutesOldString(inviteDate) {
    let out;

    let minutesOld = Math.floor((new Date() - inviteDate) / (1000 * 60));

    if (!minutesOld) {
      out = 'Just now';
    } else {
      let minuteOrMinutes = minutesOld === 1 ? 'minute' : 'minutes';
      out = `${minutesOld} ${minuteOrMinutes} ago`;
    }

    return out;
  }

  render() {
    let details = this.props.details;

    return (
      <div className="InviteListItem flex flex-column justify-center">
        <div className="flex justify-between group-details">
          <div>
            {details.leader.battleNetId}
          </div>
          <div>
            {details.members.length}/{details.groupSize}
          </div>
        </div>
        <div className="sub-title">
          {this.state.minutesOldString}
        </div>
      </div>
    );
  }
}

InviteListItem.propTypes = {
  details: PropTypes.object.isRequired
};