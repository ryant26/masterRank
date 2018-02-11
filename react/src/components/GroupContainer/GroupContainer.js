import React, {
    Component
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Model from '../../model/model';
import MemberCard from './MemberCard/TimerMemberCard';

class GroupContainer extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Model.createNewGroup(this.props.preferredHeroes.heroes[0]);
    }

    componentWillUnmount() {
        Model.leaveGroup(this.props.group.groupId);
    }

    render() {
        return (
            <div className="GroupContainer">
             <div>==================================</div>
                {this.props.group.pending &&

                    this.props.group.pending.map((member, i) =>
                        <MemberCard
                            member={member}
                            number={(i + 1)}
                            pending={true}
                            key={[member.platformDisplayName, member.heroName]}
                        />
                    )
                }
             <div>==================================</div>
            </div>
        );
    }
};

GroupContainer.propTypes = {
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

export default connect(mapStateToProps)(GroupContainer);