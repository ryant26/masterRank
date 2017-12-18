import React from 'react';
import InviteListItem from './InviteListItem';
import PropTypes from 'prop-types';

const InvitesList = ({groupInvites}) => {
  let listItems = groupInvites.slice(0,3).map((invite) => {
    return (
      <InviteListItem key={invite.groupId} details={invite}/>
    );
  });

  if (!listItems.length) {
    listItems = (
      <div className="sub-title empty-list-message flex flex-column justify-center align-center">
        <div>No pending</div>
        <div>invites</div>
      </div>
    );
  }

  return (
    <div className="InvitesList">
      <div className="list-container">
        {listItems}
      </div>
    </div>
  );
};

InvitesList.propTypes = {
  groupInvites: PropTypes.array.isRequired
};

export default InvitesList;