import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Title from 'components/Sidebar/Title/Title';
import UserCard from 'components/UserCard/UserCard';
import PreferredHeroes from 'components/Sidebar/PreferredHeroes/PreferredHeroesContainer';
import Invites from 'components/Sidebar/Invites/InvitesContainer';
import GroupContainer from 'components/Sidebar/GroupContainer/GroupContainer';

import SidebarFooter from 'components/Sidebar/SidebarFooter/SidebarFooter';

const Sidebar = ({user, region}) => {
    return (
        <div className="Sidebar flex flex-column">
            <div className="header">
                <Title/>
            </div>
            <div className="body">
                <UserCard user={user} region={region}/>
                <PreferredHeroes/>
                <Invites/>
                <GroupContainer />
            </div>
            <div className="footer">
                <SidebarFooter/>
            </div>
        </div>
    );
};

Sidebar.propTypes = {
  user: PropTypes.object.isRequired,
  region: PropTypes.string.isRequired
};

const mapStateToProps = function(state){
  return {
    user: state.user,
    region: state.region
  };
};

export default connect(mapStateToProps)(Sidebar);