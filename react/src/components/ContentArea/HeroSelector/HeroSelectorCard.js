import React from 'react';
import PropTypes from 'prop-types';
import HeroSelector from './HeroSelector';
import {connect} from 'react-redux';
import model from '../../../model/model';

const HeroSelectorCard = ({selectedHeroes}) => {

    const onSelectHero = (heroName) => {
        if (selectedHeroes.includes(heroName)) {
            model.removeHeroFilterFromStore(heroName);
        } else {
            model.addHeroFilterToStore(heroName);
        }
    };

    return (
        <div className="HeroSelectorCard flex flex-column card">
            <div className="header">
                <h3>Filter by Heroes</h3>
            </div>
            <div className="body">
                <HeroSelector selectedHeroes={selectedHeroes} onHeroSelected={onSelectHero}/>
            </div>
        </div>
    );
};

HeroSelectorCard.propTypes = {
    selectedHeroes: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        selectedHeroes: state.heroFilters
    };
};

export default connect(mapStateToProps)(HeroSelectorCard);