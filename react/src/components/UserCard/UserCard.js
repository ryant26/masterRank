import React from 'react';
import PropTypes from 'prop-types';

const UserCard = ({user, onClick, region, showRank}) => {


    function addIcon(sr) {
        if(sr < 1500) {
            return require(`assets/bronze-icon.png`);
        } else if (sr < 2000) {
            return require(`assets/silver-icon.png`);
        } else if (sr < 2500) {
            return require(`assets/gold-icon.png`);
        } else if (sr < 3000) {
            return require(`assets/platinum-icon.png`);
        } else if (sr < 3500) {
            return require(`assets/diamond-icon.png`);
        } else if (sr < 4000) {
            return require(`assets/master-icon.png`);
        } else {
            return require(`assets/grandmaster-icon.png`);
        }
    }

    let rank;

    if (showRank) {
        rank = user.skillRating ? (
            <div className="account-detail flex align-center">
                <img src={addIcon(user.skillRating)}/>
                {user.skillRating}
            </div>
        ) :
            <div className="account-detail flex">Unranked</div>;
    }

    return (
         <div className="UserCard sidebar-card flex align-center" onClick={() => {onClick(user);}}>
            <img src={user.portrait}/>
            <div className="player-info">
                <div className="display-name">{user.platformDisplayName}</div>
                <div className="flex align-center">
                    { rank }
                    <div className="account-detail flex align-center">
                        <div>{user.platform.toUpperCase()}</div>
                    </div>
                    {region &&
                        <div className="account-detail flex align-center">
                            <div>{region.toUpperCase()}</div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
    region: PropTypes.string,
    onClick: PropTypes.func,
    showRank: PropTypes.bool.isRequired
};

UserCard.defaultProps = {
    onClick: () => {},
    showRank: true
};

export default UserCard;