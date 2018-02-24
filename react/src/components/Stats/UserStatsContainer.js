import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import HeroStatsList from './HeroStatsList/HeroStatsList';
import HeroImages from './HeroImages/HeroImages';
import Model from '../../model/model';

const UserStatsContainer = ({hero, heroes, invitable, toggleModal}) => {
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

    const invitePlayer = () => {
        toggleModal();
        Model.inviteUserToGroup({
            platformDisplayName: hero.platformDisplayName,
            heroName: hero.heroName
        });
    };

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
                    <div className="button-secondary flex align-center" onClick={invitePlayer}>
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
    invitable: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        heroes: state.heroes
    };
};

export default connect(mapStateToProps)(UserStatsContainer);