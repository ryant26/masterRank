import React, {
    Component
} from 'react';
import PropTypes from 'react-redux';

export default class PlayerCard extends Component {
    render() {

        const { users = [] } = this.props;

        const cardStyle = {
            'width':'15%',
            'border':'1px solid #626262',
            'display': 'flex',            
            'alignItems':'center'
        };

        const imgStyle = {
            'height':'60px',
            'width':'60px'
        };

        const iconStyle = {
            'height':'20px',
            'width':'20px'
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
            'font-size':'11px',
            'color':'#626262'
        };

        return (
            <div className="PlayerCard" style={cardStyle}>
                <img src='https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x025000000000115A.png' style={imgStyle}/>
                <div style={imageStylePadding}>
                    <div style={inLine0}>
                        <div>wisesm0#1147</div><div>1978</div>
                    </div>
                    <div style={inLine1}>
                        <div>PC</div><div>SKILL RATING</div>
                    </div>
                </div>
            </div>
        );
    }
}