import React from 'react';
import PropTypes from 'prop-types';

import UserCard from '../UserCard/UserCard';

const UserSelector = ({users}) => {

    function onClick() {
        window.location.assign(redirectUrl());
    }

    function redirectUrl() {
        //TODO: Decide what to do about region and unhard code "us" here
        return `/auth/bnet/callback?region=us`;
    }

    return (
        <div className="UserSelector">
            { users.map((user, i) =>
                <UserCard user={user} key={i} onClick={onClick} />
            )}
        </div>
    );
};

UserSelector.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UserSelector;