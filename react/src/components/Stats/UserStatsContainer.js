import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import HeroStatsList from './HeroStatsList/HeroStatsList';
import HeroImages from './HeroImages/HeroImages';

const UserStatsContainer = ({hero, heroes, invitable}) => {
    const userHeroes = heroes.filter((userHero) => userHero.platformDisplayName === hero.platformDisplayName).sort((hero1, hero2) => {
        return hero1.priority > hero2.priority;
    });

    const wins = userHeroes.reduce((wins, hero) => {
        if (hero.stats && hero.stats.wins) {
            return wins + hero.stats.wins;
        }
        return wins;
    }, 0);

    const srNode = hero.skillRating ? <span className="sub-title"><b>{hero.skillRating}</b> SR</span> : '';
    const winsNode = wins ? <span className="sub-title"><b>{wins}</b> WINS</span> : '';

    return (
        <div className="UserStatsContainer">
            <div className="header">
                <div className="flex justify-between align-center">
                    <div>
                        <h3>{hero.platformDisplayName}</h3>
                        {srNode}
                        {winsNode}
                    </div>
                    <HeroImages heroNames={userHeroes.map((hero) => hero.heroName)}/>
                </div>
            </div>
            <div className="body">
                <HeroStatsList heroes={userHeroes}/>
            </div>
            {invitable ?
                <div className="footer flex justify-end align-center">
                    <div className="button-secondary flex align-center">
                        <div className="button-content">
                            INVITE TO GROUP
                        </div>
                    </div>
                </div> :
                undefined
            }
        </div>
    );
};

UserStatsContainer.propTypes = {
    hero: PropTypes.object,
    heroes: PropTypes.array.isRequired,
    invitable: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        heroes: state.heroes
    };
};

export default connect(mapStateToProps)(UserStatsContainer);