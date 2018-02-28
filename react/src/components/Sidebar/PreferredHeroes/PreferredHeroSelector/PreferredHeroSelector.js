import React, { Component } from 'react';
import HeroSelector from '../../../ContentArea/DashboardHome/HeroSelector/HeroSelector';
import PropTypes from 'prop-types';
import HeroSlot from '../HeroSlot/HeroSlot';

class PreferredHeroSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedHero: props.preferredHeroes[props.selectedHeroSlot - 1],
            heroForLastAction: '',
            lastActionTaken: ''
        };

        this.maxSlots = 5;
        this.setSelectedHero = this.setSelectedHero.bind(this);
        this.setSelectedSlot = this.setSelectedSlot.bind(this);
        this.setHeroPreference = this.setHeroPreference.bind(this);
        this.clearHeroPreference = this.clearHeroPreference.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setSelectedHero(this.props.preferredHeroes[nextProps.selectedHeroSlot -1]);
    }

    setSelectedHero(heroName) {
        this.setState({
            selectedHero: heroName
        });
    }

    clearHeroPreference() {
        this.setState({
            heroForLastAction: this.state.selectedHero,
            lastActionTaken: `has been removed`
        });

        this.props.clearHeroPreference();
    }

    setHeroPreference(heroName) {
        if(!this.props.preferredHeroes.includes(heroName)){
            this.props.setHeroPreference(heroName);

            this.setState({
                heroForLastAction: heroName,
                lastActionTaken: `saved as preferred hero #${this.props.selectedHeroSlot}`
            });

            this.setSelectedSlot(this.props.selectedHeroSlot + 1);
        }
    }

    setSelectedSlot(slot) {
        this.props.setSelectedHeroSlot(slot);
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
                    <HeroSelector selectedHeroes={[this.state.selectedHero]}
                                  disabledHeroes={this.props.preferredHeroes.filter((hero) => hero !== this.state.selectedHero)}
                                  onHeroSelected={this.setHeroPreference}/></div>
                <div className="footer flex align-center">
                    <div className="last-action-taken">
                        <b>{this.state.heroForLastAction.charAt(0).toUpperCase() + this.state.heroForLastAction.slice(1)}</b>{this.state.lastActionTaken}
                    </div>
                    <div className="button-group flex">
                        {this.props.preferredHeroes[this.props.selectedHeroSlot - 1] ? (
                            <div className="flex align-center button-six" onClick={this.clearHeroPreference}>
                                <div className="button-content">
                                    REMOVE
                                </div>
                            </div>
                        ) : undefined
                        }
                        {this.props.preferredHeroes.length ? (
                            <div className="save-button button-primary flex align-center" onClick={this.props.closeModal}>
                                <div className="button-content">
                                    SAVE
                                </div>
                            </div>
                        ) : undefined}

                    </div>
                </div>
            </div>
        );
    }
}

PreferredHeroSelector.propTypes = {
    selectedHeroSlot: PropTypes.number.isRequired,
    preferredHeroes: PropTypes.array.isRequired,
    setSelectedHeroSlot: PropTypes.func.isRequired,
    setHeroPreference: PropTypes.func.isRequired,
    clearHeroPreference: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired
};

export default PreferredHeroSelector;
