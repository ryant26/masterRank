import React, {Component} from 'react';
import {connect} from 'react-redux';
import HeroImage from '../../HeroImage/HeroImage';
import AddHeroIcon from './AddHeroIcon';
import Modal from 'react-modal';
import ModalContent from './PreferredHeroSelector/PreferredHeroSelector';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import Model from '../../../model/model';

class PreferredHeroesContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    
    openModalWithSlot(slot) {
        return () => {
            Model.setSelectedSlotInStore(slot);
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
        this.setState(() => {
            return {
                modalOpen: false
            };
        });
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
                <div className="flex justify-between">
                    <div className="sidebar-title">Preferred Heroes</div>
                    <FontAwesome name="cog"/>
                </div>
                <div className="flex justify-between">
                    {heroThumbnails}
                </div>
                <Modal
                    isOpen={this.state.modalOpen}
                    onRequestClose={this.closeModal}
                    ariaHideApp={false}
                    className={{
                        base: 'Hero-selector-modal',
                        afterOpen: 'Hero-selector-modal-open',
                        beforeClose: 'Hero-selector-modal-before-close'
                    }}
                    overlayClassName={{
                        base: 'Hero-selector-overlay',
                        afterOpen: 'Hero-selector-overlay-open',
                        beforeClose: 'Hero-selector-overlay-before-close'
                    }}
                >
                    <ModalContent changeSelectedHeroSlot={Model.setSelectedSlotInStore} done={this.closeModal}/>
                </Modal>
            </div>
        );
    }
}

PreferredHeroesContainer.propTypes = {
    heroes: PropTypes.array.isRequired,
    selectedSlot: PropTypes.number.isRequired
};

const mapStateToProps = (state) => {
    return {
        heroes: state.preferredHeroes.heroes,
        selectedSlot: state.preferredHeroes.selectedSlot
    };
};

export default connect(mapStateToProps)(PreferredHeroesContainer);