import React, {Component} from 'react';
import {connect} from 'react-redux';
import HeroImage from 'components/Images/HeroImage/HeroImage';
import AddHeroIcon from 'components/Sidebar/PreferredHeroes/AddHeroIcon';
import Modal from 'components/Modal/Modal';
import PreferredHeroSelector from 'components/Sidebar/PreferredHeroes/PreferredHeroSelector/PreferredHeroSelector';
import PropTypes from 'prop-types';
import Model from 'model/model';

class PreferredHeroesContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            selectedSlot: 1,
            pendingPreferredHeroes: [...props.heroes]
        };

        this.maxSlots = 5;
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setHeroPreference = this.setHeroPreference.bind(this);
        this.setSelectedSlot = this.setSelectedSlot.bind(this);
        this.clearHeroPreference = this.clearHeroPreference.bind(this);
        this.handleVisibilityEvent = this.handleVisibilityEvent.bind(this);
    }


    componentDidMount() {
        window.addEventListener('visibilitychange', this.handleVisibilityEvent);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(() => {
            return {
                pendingPreferredHeroes: [...nextProps.heroes]
            };
        });
    }

    componentWillUnmount() {
        window.removeEventListener('visibilitychange', this.handleVisibilityEvent);
    }

    setHeroPreference(heroName) {
        // In-place operation
        this.state.pendingPreferredHeroes.splice(this.state.selectedSlot - 1, 1, heroName);

        // Propigate change
        this.setState((state) => {
            return {
                pendingPreferredHeroes: state.pendingPreferredHeroes
            };
        });
    }

    clearHeroPreference() {
        // In-place operation
        this.state.pendingPreferredHeroes.splice(this.state.selectedSlot - 1, 1);

        // Propigate change
        this.setState((state) => {
            return {
                pendingPreferredHeroes: state.pendingPreferredHeroes
            };
        });
    }


    setSelectedSlot(slot) {
        let maxAllowableSlot = this.state.pendingPreferredHeroes.length + 1;
        let newSlot = maxAllowableSlot;

        if(slot <= this.maxSlots) {

            if (slot <= maxAllowableSlot) {
                newSlot = slot;
            }

            this.setState({
                selectedSlot: newSlot
            });
        }
    }

    openModalWithSlot(slot) {
        return () => {
            this.setSelectedSlot(slot);
            this.openModal();
        };
    }


    openModal() {
        this.setState(() => {
            return {
                modalOpen: true
            };
        });
    }

    closeModal() {
        Model.updatePreferredHeroes(this.state.pendingPreferredHeroes);
        this.setState(() => {
            return {
                modalOpen: false
            };
        });
    }

    handleVisibilityEvent() {
        Model.updatePreferredHeroes(JSON.parse(window.localStorage.getItem('state')).preferredHeroes.heroes);
    }

    render() {
        let heroThumbnails = this.props.heroes.map((hero, i) => {
            return (
                <HeroImage key={hero} heroName={hero} onClick={this.openModalWithSlot(i + 1)}/>
            );
        });

        for (let i = heroThumbnails.length; i < 5; i++) {
            heroThumbnails.push(<AddHeroIcon key={i} onClick={this.openModalWithSlot(i + 1)}/>);
        }

        return (
            <div className="PreferredHeroes-HeroList sidebar-card flex flex-column">
                <div className="sidebar-title">Heroes I'll Play</div>
                <div className="flex justify-between">
                    {heroThumbnails}
                </div>
                <Modal closeModal={this.closeModal} modalOpen={this.state.modalOpen}>
                    <PreferredHeroSelector
                        setSelectedHeroSlot={this.setSelectedSlot}
                        setHeroPreference={this.setHeroPreference}
                        clearHeroPreference={this.clearHeroPreference}
                        preferredHeroes={this.state.pendingPreferredHeroes}
                        selectedHeroSlot={this.state.selectedSlot}
                        closeModal={this.closeModal}
                    />
                </Modal>
            </div>
        );
    }
}

PreferredHeroesContainer.propTypes = {
    heroes: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
    return {
        heroes: state.preferredHeroes.heroes
    };
};

export default connect(mapStateToProps)(PreferredHeroesContainer);