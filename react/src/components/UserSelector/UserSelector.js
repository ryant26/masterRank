import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

import UserCard from '../UserCard/UserCard';

export default class UserSelector extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }
    //TODO: Add new unit tests
    handleClick() {
        window.location.assign(this.redirectUrl());
    }

    redirectUrl() {
        //TODO: Decide what to do about region and unhard code "us" here
        return `/auth/bnet/callback?region=us`;
    }

    render() {
        return (
            <div className="UserSelector">
                { this.props.users.map((user, i) =>
                    <UserCard user={user} key={i} handleClick={this.handleClick} />
                )}
            </div>
        );
    }
}

UserSelector.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};
