import React, {
    Component
  } from 'react';
import { connect } from 'react-redux';  
import PropTypes from 'prop-types';
import GroupHeroCard from '../GroupHeroCard/GroupHeroCard';
import HEROES from '../../../../resources/heroes';

export class GroupContainer extends Component {

    constructor(props) {
        super(props);
        this.state = { showing: false };
        this.createGroup = this.createGroup.bind(this);   
        this.leaveGroup = this.leaveGroup.bind(this);
        this.groupHeroes = this.props.groupHeroes;
        this.user = this.props.user;
    }

    createGroup() {
        // TODO: Create Group socket function
        // use 'create group' button -> fire serverEvents.createGroup
        // removes 'create group' button -> adds 'You' as initial card
        // use createGroupData -> socket server
        // creategroupdata === playerInvited from socket api wiki
    }

    leaveGroup() {
        // todo: Actually Implement
    }

    // Event Listener todo:
        // listen for group invite accepted event -> add group card to group list
        // listen for groupInviteDecline
        // listen for groupInviteCancel
        // listen for groupInviteSend from InvitePlayerButton to create and show pending text when user has not accepted invite
        // listen for playerInvited -> 
            // populate current the invited user's card with 'pending'
            // include a loading animation there: like ... dancing or something
            // timeout event after 30000 ms
               
    render() {
        // todo: implement get current users preferred hero from socket
        const usersPreferredHero = HEROES[0];
        const groupHeroCards = this.groupHeroes.map((hero,i) => {
            i = i + 2;
            return <GroupHeroCard hero={hero} name={hero.platformDisplayName} number={i.toString()} key={i.toString()} />;
        });

        return (
            <div className="GroupContainer sidebar-card flex flex-column">
            <div className="sidebar-title">Your Group</div>
                { this.state.showing 
                    ?   <div>  
                            <GroupHeroCard hero={usersPreferredHero} name={'You'} number={'1'} key={'1'} />
                            {groupHeroCards}
                            <button className="button-primary flex align-center justify-center">
                                <div className="button-content">
                                    Team Stats
                                </div>
                            </button>
                        </div>
                    :   <button className="button-primary" onClick={
                                (prevState) => {
                                    this.createGroup;
                                    this.setState({ showing: !prevState.showing });
                                }
                            }>
                            <div className="button-content">
                                Create Group
                            </div>
                        </button> 
                }
                <i className="leaveText" onClick={this.leaveGroup}>leave group</i>
            </div>
        );
    }
}

GroupContainer.propTypes = {
    user: PropTypes.object,
    groupHeroes: PropTypes.array.isRequired
};

const mapStateToProps = (state) => (
    {
      groupHeroes: state.groupHeroes
    }
);

export default connect(mapStateToProps)(GroupContainer);