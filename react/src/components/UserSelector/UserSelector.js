import React from 'react';
import PropTypes from 'prop-types';

import UserButton from './UserButton/UserButton';

const UserSelector = (props) => {

    return (
        <div className='UserSelector'>
            { props.users.map((user, i) =>
                <UserButton
                    user={user}
                    updateUserAction={props.updateUserAction}
                    key={i}
                />)
            }
        </div>
    );
}

UserSelector.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateUserAction: PropTypes.func.isRequired,
};

export default UserSelector;