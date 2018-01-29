import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

import UserCard from '../UserCard/UserCard';

export default class UserSelector extends Component {

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
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
                    <UserCard user={user} key={i} onClick={this.onClick} />
                )}
            </div>
        );
    }
}

UserSelector.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};
