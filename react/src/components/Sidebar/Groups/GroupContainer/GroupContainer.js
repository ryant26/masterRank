import React, {
    Component
  } from 'react';
import { connect } from 'react-redux';  
import PropTypes from 'prop-types';
import GroupHeroCard from '../GroupHeroCard/GroupHeroCard';
import Model from '../../../../model/model';
import Modal from "../../../Modal/Modal";
import GroupStatsContainer from "../../../Stats/GroupStatsContainer";

export class GroupContainer extends Component {

    constructor(props) {
        super(props);

        this.createGroup = this.createGroup.bind(this);   
        this.leaveGroup = this.leaveGroup.bind(this);
        this.cancelInvite = this.cancelInvite.bind(this);
        this.showGroupStats = this.showGroupStats.bind(this);
        this.hideGroupStats = this.hideGroupStats.bind(this);
        this.parentTick = this.parentTick.bind(this);
        this.pendingHeroes = [];
        this.state = {
            modalOpen: false,
            pendingHeroCounts: {}
        };
    }

    componentDidUpdate() {
        if (this.props.group.pending.length > this.pendingHeroes.length) {
            for (let i = 0; i < this.props.group.pending.length; i++) {
                if (!this.containsPlatformDisplayName(this.props.group.pending[i].platformDisplayName, this.pendingHeroes)) {
                    let heroObject = {
                        platformDisplayName: this.props.group.pending[i].platformDisplayName,
                        heroName: this.props.group.pending[i].heroName
                    };
                    this.pendingHeroes.push(heroObject);
                    this.setState(() => {
                        pendingHeroCounts: this.state.pendingHeroCounts[heroObject.platformDisplayName] = 30;
                    });
                } 
            }


            // setTimeout(() => {
            //     // if the user does not exist in the members store and user exists in the pending store
            //     // it means he has not joined as a member or been cancelled earlier
            //     // so we cancel the invite after the timeout
            //     if ((!this.props.group.members || this.props.group.members.indexOf(this.pendingHeroes[0]) === -1) &&
            //         this.props.group.pending.indexOf(this.pendingHeroes[0] !== -1)) {
            //             this.cancelInvite(this.pendingHeroes[0]);
            //     }
            //     this.pendingHeroes.shift();
            // }, 30000);
        }
    }

    parentTick (hero, currentTime) {
        this.setState(() => {
                pendingHeroCounts: this.state.pendingHeroCounts[hero.platformDisplayName] = currentTime;
        });

        if ((!this.props.group.members || this.props.group.members.indexOf(this.pendingHeroes[0]) === -1) &&
        this.props.group.pending.indexOf(this.pendingHeroes[0] !== -1)) {
            if (this.state.pendingHeroCounts[hero.platformDisplayName] === 0) {
                this.cancelInvite(this.pendingHeroes[0]);
                this.pendingHeroes.shift();
            }
        }
    }

    clearTimeouts() {}

    createGroup() {
        Model.createNewGroup(this.props.preferredHeroes.heroes[0]);
    }

    leaveGroup() {
        Model.leaveGroup(this.props.group.groupId);
    }

    cancelInvite(heroToBeRemoved) {
        Model.cancelInvite(heroToBeRemoved);
    }

    showGroupStats() {
        this.setState(() => {
            return {
                modalOpen: true
            };
        });
    }

    hideGroupStats() {
        this.setState(() => {
            return {
                modalOpen: false
            };
        });
    }

    
    getPendingHeroesFromStore() {
        return this.props.group.pending;
    }

    containsPlatformDisplayName(platformDisplayName, pendingHeroes) {
        let i;
        for (i = 0; i < pendingHeroes.length; i++) {
            if (pendingHeroes[i].platformDisplayName === platformDisplayName) {
                return true;
            }
        }
    
        return false;
    }

    render() {
        let renderMemberCards;
        let renderPendingCards;
        let groupHeroCards;
        let renderGroupAndButtons;
        let i = 1;

        renderMemberCards = this.props.group.members.map((hero) => {
            i = i + 1;
            let usersName = hero.platformDisplayName;
            if (this.props.user.platformDisplayName === usersName) {
                usersName = 'You';
            }
            return <GroupHeroCard hero={hero} number={i} userName={usersName} key={i} />;
        });

        renderPendingCards = this.pendingHeroes.map((hero) => {
            i = i + 1;
            let usersName = hero.platformDisplayName;
            if (this.props.user.platformDisplayName === usersName) {
                usersName = 'You';
            }

            return <GroupHeroCard hero={hero} number={i} userName={usersName} key={i} pending={true} count={this.state.pendingHeroCounts[hero.platformDisplayName]} parentTick={this.parentTick}/>;
        });

        renderGroupAndButtons = 
                (<div>                
                    {renderMemberCards}
                    {renderPendingCards}
                    <br/>
                    <button className="button-four flex align-center justify-center" onClick={this.showGroupStats}>
                        <div className="button-content">
                            Team Stats
                        </div>
                    </button>
                </div>);

        if (!this.props.group.leader) {
            groupHeroCards = (
                <div className="InvitesList">
                    <div className="list-container">
                        <div className="sub-title empty-list-message flex justify-center align-center">
                            <div>Not currently in a group</div>
                        </div>
                    </div>
                </div>
            );
        } else {
            if (this.props.group.leader.platformDisplayName === this.props.user.platformDisplayName){
                groupHeroCards = (
                    <div>
                        <GroupHeroCard hero={this.props.group.leader} number={1} userName={'You'} key={'1'} leader={true} /> 
                        {renderGroupAndButtons}
                    </div>
                );
            } else {
                groupHeroCards = (
                    <div>
                        <GroupHeroCard hero={this.props.group.leader} number={1} userName={this.props.group.leader.platformDisplayName} key={'1'} leader={true} /> 
                        {renderGroupAndButtons}
                        <br/>
                        <div className="flex justify-center">
                            <i className="leaveText" onClick={this.leaveGroup}>leave group</i>
                        </div>
                    </div>
                );
            } 
        } 

        return (
            <div className="GroupContainer sidebar-card flex flex-column">
                <div className="sidebar-title">Your Group</div>
                {groupHeroCards}
                <Modal modalOpen={this.state.modalOpen} closeModal={this.hideGroupStats}>
                    <GroupStatsContainer group={this.props.group} isLeading={true}/>
                </Modal>
            </div>
        );
    }
}

GroupContainer.propTypes = {
    group: PropTypes.object.isRequired,
    preferredHeroes: PropTypes.object.isRequired,
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