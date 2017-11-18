import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

export default class PlayerCard extends Component {
    render() {

        const user = this.props.user;
        const cardStyle = {
            'width':'275px',
            'border':'1px solid #626262',
            'padding':'5px',
            'margin':'10px',
            'display': 'flex',            
            'alignItems':'center'
        };

        const imgStyle = {
            'height':'60px',
            'width':'60px'
        };

        const imageStylePadding = {
            'padding': '10px 10px 10px 10px',
            'width':'100%',
        };

        const inLine0 = {
            'display': 'flex',
            'flexDirection':'row',
            'justifyContent':'space-between'
        };

        const inLine1 = {
            'display': 'flex',
            'flexDirection':'row',
            'justifyContent':'space-between',
            'fontSize':'11px',
            'color':'#626262'
        };

        return (
            <div className="PlayerCard" style={cardStyle}>
                <img src={user.portrait} style={imgStyle}/>
                <div style={imageStylePadding}>
                    <div style={inLine0}>
                        <div>{user.platformDisplayName}</div><div>{user.skillRating}</div>
                    </div>
                    <div style={inLine1}>
                        <div>{user.platform}</div><div>SKILL RATING</div>
                    </div>
                </div>
            </div>
        );
    }
}

PlayerCard.propTypes = {
    user: PropTypes.object.isRequired
};