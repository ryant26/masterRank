import React from 'react';
import HeroSelectorCard from './HeroSelector/HeroSelectorCard';
import HeroRolesContainer from './HeroRoles/HeroRolesContainer';

const ContentArea = () => {
    return (
        <div className="ContentArea flex flex-column">
            <HeroSelectorCard/>
            <HeroRolesContainer/>
        </div>
    );
};

export default ContentArea;