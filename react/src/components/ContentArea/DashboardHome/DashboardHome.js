import React from 'react';
import HeroFilters from './HeroSelector/HeroSelectorCard';
import HeroRoles from './HeroRoles/HeroRolesContainer';
import BetaCard from './Beta Card/BetaCard';

const DashboardHome = () => {
    return (
        <div className="DashboardHome flex flex-column">
            <BetaCard/>
            <HeroFilters/>
            <HeroRoles/>
        </div>
    );
};

export default DashboardHome;