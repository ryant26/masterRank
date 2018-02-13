import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Title from './Title/Title';
import UserCard from '../UserCard/UserCard';
import PreferredHeroes from './PreferredHeroes/PreferredHeroesContainer';
import Invites from './Invites/InvitesContainer';
import GroupContainer from './GroupContainer/GroupContainer';

import SidebarFooter from './SidebarFooter/SidebarFooter';

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