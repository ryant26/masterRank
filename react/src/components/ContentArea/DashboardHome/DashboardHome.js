import React from 'react';
import HeroFilters from './HeroSelector/HeroSelectorCard';
import HeroRoles from './HeroRoles/HeroRolesContainer';


const DashboardHome = () => {
    return (
        <div className="DashboardHome flex flex-column">
            <HeroFilters/>
            <HeroRoles/>
        </div>
    );
};

export default DashboardHome;