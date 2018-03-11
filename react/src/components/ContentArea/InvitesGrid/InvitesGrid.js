import React from 'react';
import {Link} from 'react-router-dom';
import {home} from 'components/Routes/links';
import {connect} from 'react-redux';
import Badge from 'components/Badge/Badge';
import InvitesGridItem from './InvitesGridItem';
import PropTypes from 'prop-types';

const InvitesGrid = ({groupInvites}) => {
    const gridItems = groupInvites.map((invite) => <InvitesGridItem key={invite.groupId} invite={invite}/>);

    return (
        <div className="InvitesGrid flex flex-column grow">
            <Link className="homeLink" to={home} style={{ textDecoration: 'none' }}>
                <div className="actionable-text"><i className="fa fa-long-arrow-left"/> back to players list</div>
            </Link>
            <div className="title flex align-center">
                <h2>Group Invites Pending</h2>
                <Badge number={groupInvites.length}/>
            </div>
            <div className="grid flex wrap">
                {gridItems}
            </div>
        </div>
    );
};

InvitesGrid.propTypes = {
    groupInvites: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        groupInvites: state.groupInvites
    };
};

export default connect(mapStateToProps)(InvitesGrid);

