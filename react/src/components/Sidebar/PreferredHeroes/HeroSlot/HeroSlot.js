import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import HeroImage from "../../../Images/HeroImage/HeroImage";

const HeroSlot = ({slotNumber, selectedSlotNumber, preferredHeroes, onSlotSelected}) => {

    const classes = classnames({
        'HeroSlot': true,
        flex: true,
        'align-center': true,
        'justify-center': true,
        selected: slotNumber === selectedSlotNumber
    });

    const onClick = function() {
        onSlotSelected(slotNumber);
    };

    const content = preferredHeroes[slotNumber - 1] ? <HeroImage heroName={preferredHeroes[slotNumber - 1]}/> : slotNumber;

    return (
        <div className={classes} onClick={onClick}>{content}</div>
    );
};

HeroSlot.propTypes = {
    slotNumber: PropTypes.number.isRequired,
    selectedSlotNumber: PropTypes.number.isRequired,
    preferredHeroes: PropTypes.array.isRequired,
    onSlotSelected: PropTypes.func.isRequired
};

export default HeroSlot;