import React, {
    Component
  } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import HeroRoles from '../components/HeroRoles';

export class HeroRolesContainer extends Component {

    render() {

        const roleStyle = {
            'display':'flex',
            'flexDirection':'row',
        };

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

        const { heroes = [] } = this.props;
        
        const hasRole = function(role, obj, heroName) {
            let roles = Object.keys(obj);
            let returnVal = false;

            roles.forEach((roleage) => {
                obj[roleage].forEach((hero) => {
                    if (heroName.name === hero && roleage === role) {
                        returnVal = true;
                    }
                });
            });

            return returnVal;
        };

        const offenseList = heroes.map(hero => {
            if (hasRole('offense', roles, hero)) {
                return hero;
            }
        }).filter(hero => hero);

        const defenseList = heroes.map(hero => {
            if (hasRole('defense', roles, hero)) {
                return hero;
            }
        }).filter(hero => hero);

        const tankList = heroes.map(hero => {
            if (hasRole('tank', roles, hero)) {
                return hero;
            }
        }).filter(hero => hero);

        const supportList = heroes.map(hero => {
            if (hasRole('support', roles, hero)) {
                return hero;
            }
        }).filter(hero => hero);
        
        return (
            <div className="HeroRoles" style={roleStyle}>
                <HeroRoles role="offense" key="offense" heroes={offenseList}/>
                <HeroRoles role="defense" key="defense" heroes={defenseList}/>
                <HeroRoles role="tank" key="tank" heroes={tankList}/>
                <HeroRoles role="support" key="support" heroes={supportList}/>
            </div>
        );
    }
}

HeroRolesContainer.propTypes = {
    heroes: PropTypes.array.isRequired,
};  

const mapStateToProps = (state) => (
    {
      heroes: state.heroes
    }
);
export default connect(mapStateToProps)(HeroRolesContainer);