import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserCard from '../../UserCard/UserCard';
import { error } from '../../Routes/links';

const UserSelector = ({users, region}) => {

    function onClick(user) {
        const platform = user.platform;
        const username = user.platformDisplayName;
        const consoleCallbackUrl = `auth/${platform}/callback?region=${region}&username=${username}&password=none`;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", consoleCallbackUrl, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
            window.location.assign(xhr.responseURL);
        };
        xhr.onerror = () => {
            window.location.assign(error);
        };
        xhr.send();
    }

    return (
        <div className="UserSelector">
            { users.map((user, i) =>
                <UserCard user={user} region={region} key={i} onClick={onClick} />
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