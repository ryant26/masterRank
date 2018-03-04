import React, {
    Component
} from 'react';

import HeroCard from '../HeroCard/HeroCard';
import PropTypes from 'prop-types';

export default class HeroRoles extends Component {

    render() {

        const heroes = this.props.heroes;
        const role = this.props.role;

        let heroCardComponents = heroes.map((hero, i) => {
            return <HeroCard hero={hero} key={i}/>;
        });

        if (!heroCardComponents.length) {
            heroCardComponents = (
                <div className="sub-title empty-list-message flex justify-center">
                    <div>No players online</div>
                </div>
            );
        }

        return (
            <div className="HeroRolesList card flex flex-column grow">
                <div className="header flex justify-between">
                    <h3>{role}</h3>
                    <img className="role-icon"
                         src={require(`../../../../../assets/${this.props.role}.png`)}
                         alt = {this.props.role+' icon'}
                    />
                </div>
                <div className="body flex flex-column">
                    { heroCardComponents }
                </div>
            </div>
        );
    }
}

HeroRoles.propTypes = {
    heroes: PropTypes.array.isRequired,
    role: PropTypes.string.isRequired,
};