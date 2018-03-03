import React from 'react';
import {Link} from 'react-router-dom';
import {home} from "../../Routes/links";

const Title = () => {
    return (
        <div className="Title">
            <Link to={home} style={{textDecoration: 'none'}}>
                <div className="flex align-center justify-between">
                    <img src={require('../../../assets/logo-icon.png')} alt="logo-icon"/>
                    <div className="fireteam">FIRETEAM.GG</div>
                    <div className="alpha-tag">Alpha</div>
                </div>
            </Link>
        </div>
    );
};

export default Title;