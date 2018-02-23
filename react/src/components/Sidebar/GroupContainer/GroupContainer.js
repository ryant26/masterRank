import React, {
    Component
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Model from '../../../model/model';
import MemberCard from './MemberCard/MemberCard';
import Modal from "../../Modal/Modal";
import GroupStatsContainer from "../../Stats/GroupStatsContainer";

class GroupContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };

        this.toggleModal = this.toggleModal.bind(this);
    }

    componentWillUnmount() {
        Model.leaveGroup();
    }

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    render() {
        let leader = this.props.group.leader;
        let members =  this.props.group.members;
        let pendingMembers = this.props.group.pending;

        return (
            <div className="GroupContainer">
                 <div>
                    { leader &&
                        <MemberCard
                            member={leader}
                            leader={true}
                            pending={false}
                            number={1}
                            key={[leader.platformDisplayName, leader.heroName]}
                        />
                    }
                    { members &&
                        members.map((member, i) => (
                            <MemberCard
                                member={member}
                                leader={false}
                                pending={false}
                                number={(i + 2)}
                                key={[member.platformDisplayName, member.heroName]}
                            />
                        ))
                    }
                    { pendingMembers &&
                        pendingMembers.map((member, i) => (
                            <MemberCard
                                member={member}
                                leader={false}
                                pending={true}
                                number={(members.length + 2 + i)}
                                key={member.platformDisplayName}
                            />
                        ))
                    }
                    <button className="button-four flex align-center justify-center" onClick={this.toggleModal}>
                        <div className="button-content">
                            Team Stats
                        </div>
                    </button>
                 </div>
                 <Modal modalOpen={this.state.showModal} closeModal={this.toggleModal}>
                     <GroupStatsContainer group={this.props.group} isLeading={true}/>
                 </Modal>
            </div>
        );
    }
}

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