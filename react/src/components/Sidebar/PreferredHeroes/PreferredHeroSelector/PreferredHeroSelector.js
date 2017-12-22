import React, { Component } from 'react';
import HeroSelector from '../../../HeroSelector/HeroSelector';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import HeroSlot from '../HeroSlot/HeroSlot';
import Model from '../../../../model/model';

class PreferredHeroSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedHero: props.preferredHeroes[props.selectedHeroSlot - 1],
            continueButtonDisabled: true
        };

        this.maxSlots = 5;
        this.setSelectedHero = this.setSelectedHero.bind(this);
        this.setPreferredHero = this.setPreferredHero.bind(this);
        this.setSelectedSlot = this.setSelectedSlot.bind(this);
    }

    setSelectedHero(heroName) {
        let continueButtonDisabled = false;

        if(this.props.preferredHeroes.includes(heroName) || !heroName) {
            continueButtonDisabled = true;
        }

        this.setState({
            selectedHero: heroName,
            continueButtonDisabled
        });
    }

    setSelectedSlot(slot) {
        Model.setSelectedSlotInStore(slot);
        this.setSelectedHero(this.props.preferredHeroes[slot - 1]);
    }

    setPreferredHero() {
        Model.addPreferredHero(this.state.selectedHero, this.props.selectedHeroSlot);
        this.setSelectedHero(undefined);
    }

    render() {
        let heroSlots = [];
        for (let i = 1; i <= this.maxSlots; i++) {
            heroSlots.push(
                <HeroSlot
                    key={i}
                    slotNumber={i}
                    selectedSlotNumber={this.props.selectedHeroSlot}
                    preferredHeroes={this.props.preferredHeroes}
                    onSlotSelected={this.setSelectedSlot}
                />
            );
        }

        return (
            <div className="PreferredHeroSelector flex flex-column">
                <div className="header flex justify-between align-center">
                    <div>
                        <h3>Preferred Heroes</h3>
                        <div className="sub-title">Choose up to five preferred heroes to play.</div>
                    </div>
                    <div className="flex justify-between hero-slots">
                        {heroSlots}
                    </div>
                </div>
                <div className="body">
                    <HeroSelector selectedHeroes={[this.state.selectedHero]} onHeroSelected={this.setSelectedHero}/>
                </div>
                <div className="footer flex justify-end">
                    <div className="flex align-center button-tertiary" onClick={this.props.done}>
                        <div>
                            Done
                        </div>
                    </div>
                    <button type="button" className="button-primary flex align-center" onClick={this.setPreferredHero} disabled={this.state.continueButtonDisabled}>
                        <div className="button-content">
                            Continue
                        </div>
                    </button>
                </div>
            </div>
        );
    }
}

PreferredHeroSelector.propTypes = {
    selectedHeroSlot: PropTypes.number.isRequired,
    preferredHeroes: PropTypes.array.isRequired,
    changeSelectedHeroSlot: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        preferredHeroes: state.preferredHeroes.heroes,
        selectedHeroSlot: state.preferredHeroes.selectedSlot
    };
};


export default connect(mapStateToProps)(PreferredHeroSelector);

// TODO Clean up container structure of prefHeroContainer / HeroList
// TODO Make API call to add pref hero
// TODO - handle error
// TODO - add unit tests