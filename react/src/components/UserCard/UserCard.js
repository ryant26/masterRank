import React from 'react';
import PropTypes from 'prop-types';

const UserCard = ({user, onClick}) => {

    function addComma(x) {
        return x.toLocaleString();
    }

    function addIcon(sr) {
        if(sr < 1500) {
            return "https://overwatch.gamepedia.com/media/overwatch.gamepedia.com/8/89/Badge_1_Bronze.png?version=ad7998775b2d62d071d7c0200c6f3503";
        } else if (sr < 2000) {
            return "https://overwatch.gamepedia.com/media/overwatch.gamepedia.com/b/bb/Badge_2_Silver.png?version=d3c7bb3dbf3d0a095aa67272e6c1d5ca";
        } else if (sr < 2500) {
            return "https://overwatch.gamepedia.com/media/overwatch.gamepedia.com/b/b8/Badge_3_Gold.png?version=8db92000f05a59cc22fcf3bb859a3f5c";
        } else if (sr < 3000) {
            return "https://overwatch.gamepedia.com/media/overwatch.gamepedia.com/f/f8/Badge_4_Platinum.png?version=95774c0cbbcfe53dcf06a51988b62ccf";
        } else if (sr < 3500) {
            return "https://overwatch.gamepedia.com/media/overwatch.gamepedia.com/2/2f/Badge_5_Diamond.png?version=f1073624c5b242253894b998d858f6ca";
        } else if (sr < 4000) {
            return "https://overwatch.gamepedia.com/media/overwatch.gamepedia.com/f/f0/Badge_6_Master.png?version=5ff0ee51ad39830bdb8f81e192644990";
        } else {
            return "https://overwatch.gamepedia.com/media/overwatch.gamepedia.com/8/87/Badge_7_Grandmaster.png?version=06549c9802f5942d753acf5fa1eea998";
        }
    }

    return (
        //TODO: Add new unit tests
        //TODO: In the future for PSN and Xbox users, handleClick() will pass user, handleClick(user)
         <div className="UserCard sidebar-card" onClick={() => {onClick();}}>
            <img src={user.portrait}/>
            <div className="ImagePadding">
                <div className="heroInfo">
                    <div>{user.platformDisplayName}</div>
                    { user.skillRating &&
                        <div className="rank">
                            <img src={addIcon(user.skillRating)}/>
                            {addComma(user.skillRating)}
                        </div>
                    }
                </div>
                <div className="metaLabels">
                    <div>{user.platform}</div>
                </div>
            </div>
        </div>
    );
};

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
    onClick: PropTypes.func
};

UserCard.defaultProps = {
  onClick: () => {}
};

export default UserCard;