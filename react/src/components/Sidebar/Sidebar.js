import React from 'react';

import PropTypes from 'prop-types';

import Title from './Title/Title';
import UserCard from '../UserCard/UserCard';
import PreferredHeroes from './PreferredHeroes/PreferredHeroesContainer';
import Invites from './Invites/InvitesContainer';
import Group from './Groups/GroupContainer/GroupContainer';
import SidebarFooter from './sidebar-footer/sidebar-footer';

const Sidebar = (props) => {
    return (
        <div className="Sidebar flex flex-column">
            <div className="header">
                <Title/>
            </div>
            <div className="body">
                <UserCard user={props.user} />
                <PreferredHeroes/>
                <Invites/>
                <Group group={props.user} />
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

export default Sidebar;