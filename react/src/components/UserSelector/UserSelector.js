import React from 'react';
import PropTypes from 'prop-types';

import UserCard from '../UserCard/UserCard';

const UserSelector = ({users}) => {

    function onClick() {
        //TODO: Add logic for Xbox & psn login
        window.location.assign('/waiting');
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