import React, {
    Component
} from 'react';

import HeroCard from '../HeroCard/HeroCard';
import PropTypes from 'prop-types';

export default class HeroRoles extends Component {

    render() {

        const roleCardStyle = {
            'display':'flex',
            'borderStyle':'solid',
            'padding':'5px 20px',
            'justifyContent':'center'
        };

        const cardContainerStyle = {
            'display':'flex',
            'flexDirection':'column',
            'borderStyle':'solid',
            'padding':'5px 20px'
        };

        const heroes = this.props.heroes;
        const role = this.props.role;
        let i = 0; 
        
        const heroCardComponents = heroes.map(hero => {
            i = i + 1;
            return <HeroCard hero={hero} key={i.toString()} />;
        });

        return (
            <div className="HeroRoles">
                <div className="RoleCard" style={roleCardStyle}>
                    { role }
                </div>
                <div className="CardContainer" style={cardContainerStyle}>
                    { heroCardComponents }
                </div>
            </div>
        );
    }
}

HeroRoles.propTypes = {
    heroes: PropTypes.array.isRequired,
    role: PropTypes.string.isRequired
};