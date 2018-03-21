import React from 'react';

import HeroCard from 'components/ContentArea/DashboardHome/HeroRoles/HeroCard/HeroCard';
import PropTypes from 'prop-types';

const HeroRolesList = ({heroes, role}) => {

    const getWinRate = (hero) => {

        if (hero.stats) {
            let wins = hero.stats.wins || 0;
            let gamesPlayed = hero.stats.gamesPlayed || 1;

            return wins / gamesPlayed;
        }

        return 0;
    };

    let heroCardComponents = heroes.sort((h1, h2) => getWinRate(h1) < getWinRate(h2)).map((hero) => {
        return <HeroCard hero={hero} key={hero.platformDisplayName + hero.heroName + hero.priority}/>;
    });

    if (!heroCardComponents.length) {
        heroCardComponents = (
            <div className="sub-title empty-list-message flex justify-center">
                <div>No players online</div>
            </div>
        );
    }


    return (
        <div className="HeroRolesList card flex flex-column grow">
            <div className="header flex justify-between">
                <h3>{role}</h3>
                <img className="role-icon"
                     src={require(`assets/${role}.png`)}
                     alt = {`${role} icon`}
                />
            </div>
            <div className="body flex flex-column">
                { heroCardComponents }
            </div>
        </div>
    );

};

HeroRolesList.propTypes = {
    heroes: PropTypes.array.isRequired,
    role: PropTypes.string.isRequired,
};

export default HeroRolesList;