import React from 'react';
import HeroFilters from './HeroSelector/HeroSelectorCard';
import HeroRoles from './HeroRoles/HeroRolesContainer';
import AlphaCard from './AlphaCard/AlphaCard';

const DashboardHome = () => {
    return (
        <div className="DashboardHome flex flex-column">
            <AlphaCard/>
            <HeroFilters/>
            <HeroRoles/>
        </div>
    );
};

export default DashboardHome;