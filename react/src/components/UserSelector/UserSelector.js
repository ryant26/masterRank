import React from 'react';
import PropTypes from 'prop-types';

import UserButton from './UserButton/UserButton';

const UserSelector = ({users}) => {

    return (
        <div className="UserSelector">
            { users.map((user, i) =>
                <UserButton user={user} key={i} />
            )}
        </div>
    );
};

UserSelector.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UserSelector;