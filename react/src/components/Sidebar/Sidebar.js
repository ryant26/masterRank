import React from 'react';
import Title from './Title/Title';
import PlayerCard from './PlayerCard/PlayerCard';
import PreferredHeroes from './PreferredHeroes/PreferredHeroesContainer';
import Invites from './Invites/InvitesContainer';
import Group from './Groups/GroupContainer/GroupContainer';
import SidebarFooter from './sidebar-footer/sidebar-footer';
import * as users from '../../resources/users';

const Sidebar = () => {
    return (
        <div className="Sidebar flex flex-column">
            <div className="header">
                <Title/>
            </div>
            <div className="body">
                <PlayerCard user={users.users[0]}/>
                <PreferredHeroes/>
                <Invites/>
                <Group group={users.users[0]}/>
            </div>
            <div className="footer">
                <SidebarFooter/>
            </div>
        </div>
    );
};

export default Sidebar;
