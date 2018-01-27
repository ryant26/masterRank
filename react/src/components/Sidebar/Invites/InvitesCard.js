import React from 'react';
import Badge from '../Badge/Badge';
import InvitesList from './InvitesList';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {allInvites} from "../../Routes/links";

let InvitesCard = ({groupInvites}) => {
  let button = groupInvites.length ? (
      <Link to={allInvites} style={{ textDecoration: 'none' }}>
        <div className="button-secondary flex align-center justify-center">
          <div className="button-content">
            All Invites
          </div>
        </div>
      </Link>
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

