import React, {
    Component
  } from 'react';
import { connect } from 'react-redux';  
import PropTypes from 'prop-types';
import GroupHeroCard from '../../components/GroupHeroCard/GroupHeroCard';

export class GroupContainer extends Component {

    constructor(props) {
        super(props);
        this.state = { showing: false };
        this.createGroup = this.createGroup.bind(this);   
        this.leaveGroup = this.leaveGroup.bind(this);
    }

    createGroup() {
        // TODO: Create Group socket function
        // use 'create group' button -> fire serverEvents.createGroup
        // removes 'create group' button -> adds 'You' as initial card
        // use createGroupData -> socket server
        // creategroupdata === playerInvited from socket api wiki
    }

    leaveGroup() {
        // TODO: Actually Implement
    }

    // Event Listener TODOs:
        // listen for group invite accepted event -> add group card to group list
        // listen for groupInviteDecline
        // listen for groupInviteCancel
        // listen for groupInviteSend from InvitePlayerButton to create and show pending text when user has not accepted invite
        // listen for playerInvited -> 
            // populate current the invited user's card with 'pending'
            // include a loading animation there: like ... dancing or something
            // timeout event after 30000 ms
               
    render() {
        const { group = [] } = this.props;
        let i = 0;

        const groupHeroCards = group.map(hero => {
            i = i + 1;
            return <GroupHeroCard hero={hero} number={i.toString()} key={i.toString()} />;
        });

        return (
            <div className="GroupContainer">
                <div className="inLine0">
                    <div className="sidebar-title">Your Group</div>
                </div>
                { this.state.showing 
                    ?   <div>  
                            {groupHeroCards}
                            <button className="button-primary">
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
                <a className="leaveText" onClick={this.leaveGroup}><i>leave group</i></a>
            </div>
        );
    }
}

GroupContainer.propTypes = {
    user: PropTypes.object.isRequired,
    group: PropTypes.array.isRequired
};

const mapStateToProps = (state) => (
    {
      group: state.group
    }
);

export default connect(mapStateToProps)(GroupContainer);