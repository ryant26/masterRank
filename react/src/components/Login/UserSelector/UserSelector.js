import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserCard from '../../UserCard/UserCard';
import { error } from '../../Routes/links';

const UserSelector = ({users, region}) => {

    function onClick(user) {
        authenticationUrl(user);
    }

    function authenticationUrl(user) {
        //TODO: DO we want to get platform from the user clicked on or the radio selected?
        //I think we should get it from user, but search should be filtred by xbl or psn
        let platform = user.platform;
        let username = user.platformDisplayName;
        //TODO: Password can be anything but it must be passed, Make this cleaner
        let consoleCallbackUrl = `auth/${platform}/callback?region=${region}&username=${username}&password=none`;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", consoleCallbackUrl, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
            window.location.assign(xhr.responseURL);
        };
        xhr.onerror = () => {
            window.location.assign({error});
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