import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import UserCard from 'components/UserCard/UserCard';
import {
    pushBlockingEvent as pushLoadingEventAction,
    popBlockingEvent as popLoadingEventAction
} from 'actionCreators/loading';
import { startLoginTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';

const UserSelector = ({users, region, dispatchStartLoginTrackingEvent, setLoading, clearLoading}) => {

    function onClick(user) {
        const platform = user.platform;
        const username = user.platformDisplayName;
        const consoleCallbackUrl = `/auth/${platform}/callback?region=${region}&username=${username}&password=none`;

        dispatchStartLoginTrackingEvent(platform);
        setLoading();

        let xhr = new XMLHttpRequest();
        xhr.open("POST", consoleCallbackUrl, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
            window.location.assign(xhr.responseURL);
            clearLoading();
        };
        xhr.onerror = () => {
            clearLoading();
        };
        xhr.send();
    }

    return (
        <div className="UserSelector">
            { users.map((user, i) =>
                <UserCard user={user} region={region} key={i} onClick={onClick} showRank={!!user.skillRating}/>
            )}
        </div>
    );
};

UserSelector.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  region: PropTypes.string.isRequired,
  dispatchStartLoginTrackingEvent: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  clearLoading: PropTypes.func.isRequired
};

const mapStateToProps = function(state){
  return {
    region: state.region,
  };
};

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        dispatchStartLoginTrackingEvent: startLoginTrackingEvent,
        setLoading: pushLoadingEventAction,
        clearLoading: popLoadingEventAction
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSelector);