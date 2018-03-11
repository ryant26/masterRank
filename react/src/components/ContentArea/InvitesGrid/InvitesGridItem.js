import React from 'react';
import PropTypes from 'prop-types';

import HeroCard from 'components/ContentArea/DashboardHome/HeroRoles/HeroCard/HeroCard';
import Model from 'model/model';

const InvitesGridItem = ({invite}) => {
    let numberOfMembers = invite.members.length + 1;
    let baseSr = invite.leader.skillRating;
    baseSr = invite.members.reduce((sr, member) => sr + member.skillRating, baseSr);
    let avgSrString = (baseSr/numberOfMembers).toFixed(0);

    let groupHeroes = [<HeroCard key={invite.leader.platformDisplayName} hero={invite.leader} invitable={false}/>];
    invite.members.forEach((member) => {
        groupHeroes.push(<HeroCard key={member.platformDisplayName} hero={member} invitable={false}/>);
    });
    invite.pending.forEach((member) => {
        groupHeroes.push(<HeroCard key={member.platformDisplayName} hero={member} invitable={false}/>);
    });

    const declineInvite = () => {
        Model.declineGroupInviteAndRemoveFromStore(invite);
    };

    const acceptInvite = () => {
        Model.leaveGroup();
        Model.acceptGroupInviteAndRemoveFromStore(invite);
    };

    return (
        <div className="InvitesGridItem flex flex-column card">
            <div className="header">
                <div className="group-title flex align-center justify-center">
                    <h3>{invite.leader.platformDisplayName}'s</h3>
                    <h3 className="regular">Group</h3>
                </div>
                <div className="groupSR sub-title flex align-center justify-center">
                    {avgSrString} Group SR
                </div>
            </div>
            <div className="body flex flex-column">
                {groupHeroes}
            </div>
            <div className="button-group flex justify-around">
                <div
                    className="button button-six flex justify-center align-center"
                    onClick={declineInvite}
                >
                    <div className="button-content">
                        DECLINE
                    </div>
                </div>
                <div
                    className="button button-secondary flex justify-center align-center"
                    onClick={acceptInvite}
                >
                    <div className="button-content">
                        ACCEPT
                    </div>
                </div>
            </div>
        </div>
    );
};

InvitesGridItem.propTypes = {
    invite: PropTypes.shape({
        leader: PropTypes.object.isRequired,
        members: PropTypes.array.isRequired,
        pending: PropTypes.array.isRequired,
    }).isRequired,
};

export default InvitesGridItem;