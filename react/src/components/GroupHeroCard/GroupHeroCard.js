import React, {
    Component
} from 'react';
import HeroImage from '../HeroImage/HeroImage';
import PropTypes from 'prop-types';

export default class GroupHeroCard extends Component {

    render() {
        const hero = this.props.hero;
        const orderVal = this.props.number;

        return (
            <div className="GroupHeroCard">
                <div className="numberBox">{orderVal}</div>
                <HeroImage heroName={hero.heroName}/>
                <div className="imageStylePadding">
                    <div className="inLine0">
                        <b>{hero.platformDisplayName}</b>
                        {/* will also be 'You' when we first create group */}
                    </div>
                    <div className="inLine1">
                        <div>{hero.heroName}</div>
                    </div>
                </div>
            </div>
        );
    }
}    

GroupHeroCard.propTypes = {
    hero: PropTypes.object.isRequired,
    number: PropTypes.string.isRequired
};