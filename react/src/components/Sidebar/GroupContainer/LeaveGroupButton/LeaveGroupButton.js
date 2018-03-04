import React from 'react';

import Model from '../../../../model/model';

const LeaveGroupButton = () => {

    const leaveGroup = () => {
        Model.leaveGroup();
        Model.createNewGroup();
    };

    return(
        <div className="LeaveGroupButton flex align-center justify-center" onClick={leaveGroup}>
            LEAVE GROUP
        </div>
    );
};

export default LeaveGroupButton;