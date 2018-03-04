import React, {
    Component
  } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import HeroList from './HeroRolesList/HeroRolesList';
const heroNames = require('../../../../../../shared/libs/allHeroNames');

export class HeroRolesContainer extends Component {

    render() {
        let offensiveHeroes = [];
        let defensiveHeroes = [];
        let tankHeroes = [];
        let supportHeroes = [];

        let addHeroToRole = function(hero, role, filters, roleList) {
            let applicableFilters = [];

            if (filters.length) {
                applicableFilters = heroNames[role].filter((heroName) => {
                    return filters.includes(heroName);
                });
            }

            if (!applicableFilters.length) {
                applicableFilters = heroNames[role];
            }

            if (applicableFilters.includes(hero.heroName)) {
                roleList.push(hero);
            }
        };

        this.props.heroes.forEach((hero) => {
            addHeroToRole(hero, 'offensive', this.props.filters, offensiveHeroes);
            addHeroToRole(hero, 'defensive', this.props.filters, defensiveHeroes);
            addHeroToRole(hero, 'tank', this.props.filters, tankHeroes);
            addHeroToRole(hero, 'support', this.props.filters, supportHeroes);
        });

        return (
            <div className="HeroRolesContainer flex justify-between stretch">
                <HeroList role="Offense" key="Offense" heroes={offensiveHeroes}/>
                <HeroList role="Defense" key="Defense" heroes={defensiveHeroes}/>
                <HeroList role="Tank" key="Tank" heroes={tankHeroes}/>
                <HeroList role="Support" key="Support" heroes={supportHeroes}/>
            </div>
        );
    }
}

HeroRolesContainer.propTypes = {
    heroes: PropTypes.array.isRequired,
    filters: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => (
    {
        heroes: state.heroes,
        filters: state.heroFilters,
    }
);
export default connect(mapStateToProps)(HeroRolesContainer);