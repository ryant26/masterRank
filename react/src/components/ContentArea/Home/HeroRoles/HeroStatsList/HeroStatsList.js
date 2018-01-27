import React from 'react';
import {connect} from 'react-redux';

import PropTypes from 'prop-types';
import HeroImage from '../../../../HeroImage/HeroImage';
import HeroStatsCard from "../HeroStatsListItem/HeroStatsListItem";

const HeroStatsList =  ({hero, heroes}) => {

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

    const heroImages = userHeroes.map((hero, i) => <HeroImage key={i} heroName={hero.heroName}/>);

    let heroStatsCards = userHeroes.filter((hero) => hero.stats).map((hero, i) => <HeroStatsCard key={i} hero={hero}/>);

    if (!heroStatsCards.length) {
        heroStatsCards = <div className="flex justify-center sub-title">We have no stats on this player.</div>;
    }

    return (
      <div className="HeroStatsList">
        <div className="header">
          <div className="flex justify-between align-center">
              <div>
                  <h3>{hero.platformDisplayName}</h3>
                  {srNode}
                  {winsNode}
              </div>
              <div className="preferredHeroIcons">
                  {heroImages}
              </div>
          </div>
        </div>
        <div className="body">
            {heroStatsCards}
        </div>
        <div className="footer flex justify-end align-center">
            <div className="button-secondary flex align-center">
                <div className="button-content">
                    INVITE TO GROUP
                </div>
            </div>
        </div>
      </div>
    );
};

HeroStatsList.propTypes = {
    hero: PropTypes.object,
    heroes: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        heroes: state.heroes
    };
};

export default connect(mapStateToProps)(HeroStatsList);