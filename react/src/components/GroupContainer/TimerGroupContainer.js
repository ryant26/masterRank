import React, {
    Component
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Model from '../../model/model';
import MemberCard from './MemberCard/MemberCard';

class TimerGroupContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timers: {},
        }

        this.cancelInvite = this.cancelInvite.bind(this);
        this.setTimers = this.setTimers.bind(this);
    }

    //TODO: CRUD for group
    componentDidMount() {
        Model.createNewGroup(this.props.preferredHeroes.heroes[0]);
    }

    componentWillUnmount() {
        Model.leaveGroup(this.props.group.groupId);
        for( let key in this.state.timers) {
            clearInterval(this.state.timers[key]);
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setTimers(nextProps);
    }

    setTimers(nextProps) {
        if(nextProps.group.pending){
            let currentTimers = this.state.timers;
            //Assumes only one prop can update at a time
            nextProps.group.pending.map((member) => {
                let key = [member.platformDisplayName, member.heroName];
                if(!currentTimers[key])
                    //No timer exists
                    currentTimers[key] =
                        setInterval(() => {this.cancelInvite(member)}, 5000);
            });

            this.setState({
                timers: currentTimers
            })
        }
    }

    cancelInvite(member) {
        let key = [member.platformDisplayName, member.heroName];
        alert(`${key}`);
        Model.cancelInvite({
           platformDisplayName: member.platformDisplayName,
           heroName: member.heroName
        });
        clearInterval(this.state.timers[key]);
        delete this.state.timers[key];
    }

    render() {
        return (
            <div className="TimerGroupContainer">
             <div>==================================</div>
                {this.props.group.pending &&

                    this.props.group.pending.map((member, i) =>
                        <MemberCard member={member} number={(i + 1)} key={i}/>
                    )
                }
             <div>==================================</div>
            </div>
        );
    }
};

TimerGroupContainer.propTypes = {
    group: PropTypes.shape({
        groupId: PropTypes.number,
        members: PropTypes.arrayOf(PropTypes.shape({
            heroName: PropTypes.string,
            platformDisplayName: PropTypes.string,
            skillRating: PropTypes.number,
            stats: PropTypes.object,
        })),
        pending: PropTypes.array,
        leader: PropTypes.shape({
            heroName: PropTypes.string,
            platformDisplayName: PropTypes.string,
            skillRating: PropTypes.number,
            stats: PropTypes.object,
        }),
    }),
    preferredHeroes: PropTypes.shape({
        heroes: PropTypes.array
    }).isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
      group: state.group,
      preferredHeroes: state.preferredHeroes,
      user: state.user
    };
};

export default connect(mapStateToProps)(TimerGroupContainer);