import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserCard from '../UserCard/UserCard';

const UserSelector = ({users, region}) => {

    function onClick(user) {
        window.location.assign(authenticationUrl(user));
    }

    function authenticationUrl(user) {
        let platform = user.platform;
        let username = user.platformDisplayName;
        //TODO: Password can be anything but it must be passed, Make this cleaner
        return `/auth/${platform}/callback?region=${region}&username=${username}&password=password`;
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
  region: PropTypes.string.isRequired,
};

const mapStateToProps = function(state){
  return {
    region: state.region,
  };
};

export default connect(mapStateToProps)(UserSelector);