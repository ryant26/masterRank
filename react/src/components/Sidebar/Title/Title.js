import React from 'react';
import {Link} from 'react-router-dom';
import {home} from "../../Routes/links";

const Title = () => {
  return (
    <div className="Title">
      <Link to={home} style={{ textDecoration: 'none' }}>
        <div className="flex align-center">
          <img src={require('../../../assets/logo-icon.svg')} alt="logo-icon"/>
          <h1>FIRETEAM.GG</h1>
        </div>
      </Link>
    </div>
  );
};

export default Title;