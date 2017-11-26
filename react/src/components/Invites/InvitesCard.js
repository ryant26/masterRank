import React from 'react';
import Badge from '../Badge/Badge';
import InvitesList from './InvitesList';
import PropTypes from 'prop-types';

let InvitesCard = ({groupInvites}) => {
  let button = groupInvites.length ? (
    <div className="button-secondary flex align-center justify-center">
      <div className="button-content">
        All Invites
      </div>
    </div>
  ) : '';

  return (
    <div className="flex flex-column sidebar-card">
      <div className="flex align-center justify-between sidebar-title">
        <div>
          Invites
        </div>
        <Badge number={groupInvites.length}/>
      </div>
      <InvitesList groupInvites={groupInvites}/>
      {button}
    </div>
  );
};

InvitesCard.propTypes = {
  groupInvites: PropTypes.array.isRequired
};

export default InvitesCard;

