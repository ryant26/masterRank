import React from 'react';
import InvitesCard from './InvitesCard';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const InvitesContainer = (props) => {
  return (
    <InvitesCard groupInvites={props.groupInvites}/>
  );
};

InvitesContainer.propTypes = {
  groupInvites: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  return {
    groupInvites: state.groupInvites
  };
};

export default connect(mapStateToProps)(InvitesContainer);