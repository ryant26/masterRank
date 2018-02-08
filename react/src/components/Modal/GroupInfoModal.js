import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Modal from './Modal';
import GroupStatsContainer from '../Stats/GroupStatsContainer';

const GroupInfoModal = ({group, user}) => {
    let open = false;

    if (group.leader) {
        open = group.leader.platformDisplayName !== user.platformDisplayName;
    }

    return (
        <Modal modalOpen={open} closeModal={() => {}} closable={false}>
            <GroupStatsContainer group={group} isLeading={false}/>
        </Modal>
    );
};

const mapStateToProps = (state) => {
    return {
        group: state.group,
        user: state.user
    };
};

GroupInfoModal.propTypes = {
    group: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(GroupInfoModal);