import React, {
    Component
} from 'react';

import { connect } from 'react-redux';
import HeroCard from './HeroCard.js';

export class HeroRoles extends Component {

    render() {

        const offenseChars = ['doomfist', 'genji', 'mccree', 'pharah', 'reaper', 'soldier76', 'sombra', 'tracer'];
        const defenseChars = ['bastion', 'hanzo', 'junkrat', 'mei', 'torbjorn', 'widowmaker'];
        const tankChars = ['dva', 'orisa', 'reinhardt', 'roadhog', 'winston', 'zarya']; 
        const supportChars = ['ana', 'lucio', 'mercy', 'symmetra', 'zenyatta']; 
        const roles = {
            offense: offenseChars,
            defense: defenseChars,
            tank: tankChars,
            support: supportChars
        };

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

        const {heroes = []} = this.props;
        const role = this.props.role;  
        
        const hasRole = function(obj, heroName) {
            let roles = Object.keys(obj);
            let returnVal = false;

            roles.map((roleage) => {
                obj[roleage].map((hero) => {
                    if (heroName.name === hero && roleage === role) {
                        returnVal = true;
                    }
                });
            });

            return returnVal;
        }
        
        const heroCardComponents = heroes.map(hero => {
            if (hasRole(roles, hero)) {
                return <HeroCard hero={hero} key={Math.random().toString()} />
            }
        });

        return (
            <div>
                <div className="RoleCard" style={roleCardStyle}>
                    {role}
                </div>
                <div className="CardContainer" style={cardContainerStyle}>
                    { heroCardComponents }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => (
    {
      heroes: state.heroes
    }
);
export default connect(mapStateToProps)(HeroRoles);