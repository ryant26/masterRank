import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Title from './Title/Title';
import UserCard from '../UserCard/UserCard';
import PreferredHeroes from './PreferredHeroes/PreferredHeroesContainer';
import Invites from './Invites/InvitesContainer';
import Group from './Groups/GroupContainer/GroupContainer';
import SidebarFooter from './sidebar-footer/sidebar-footer';

const Sidebar = ({user}) => {
    return (
        <div className="Sidebar flex flex-column">
            <div className="header">
                <Title/>
            </div>
            <div className="body">
                <UserCard user={user} />
                <PreferredHeroes/>
                <Invites/>
                <Group />
            </div>
            <div className="footer">
                <SidebarFooter/>
            </div>
        </div>
    );
};

Sidebar.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = function(state){
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Sidebar);