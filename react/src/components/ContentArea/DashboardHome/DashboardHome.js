import React from 'react';
import HeroFilters from 'components/ContentArea/DashboardHome/HeroSelector/HeroSelectorCard';
import HeroRoles from 'components/ContentArea/DashboardHome/HeroRoles/HeroRolesContainer';
import AlphaCard from 'components/ContentArea/DashboardHome/AlphaCard/AlphaCard';

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