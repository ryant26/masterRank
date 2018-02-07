import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserCard from '../../UserCard/UserCard';

const UserSelector = ({users, region}) => {

    function onClick(user) {
        let platform = user.platform;
        let username = user.platformDisplayName;
        //TODO: Password can be anything but it must be passed, Make this cleaner
        let consoleCallbackUrl = `auth/${platform}/callback?region=${region}&username=${username}&password=none`;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", consoleCallbackUrl, true);
        xhr.onload = () => {
            window.location.assign(xhr.responseURL);
        };
        xhr.onerror = () => {
            window.location.assign("/error");
        };
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send();
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