import React, {
  Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PlatformSelection from '../../components/Login/PlatformSelection/PlatformSelection';
import RegionSelection from '../../components/Login/RegionSelection/RegionSelection';
import ConsoleUserSearch from '../../components/Login/ConsoleUserSearch/ConsoleUserSearch';
import BlizzardOAuth from '../../components/Login/BlizzardOAuth/BlizzardOAuth';
import {updateRegion as updateRegionAction} from '../../actions/region';


class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            platform: 'pc',
            region: 'us',
        };
        this.props.updateRegionAction(this.state.region);

        this.onPlatformClick = this.onPlatformClick.bind(this);
        this.onRegionClick = this.onRegionClick.bind(this);
    }

    onPlatformClick(event) {
        this.setState({
            platform: event.target.value,
        });
    }

    onRegionClick(event) {
        this.props.updateRegionAction(event.target.value);
        this.setState({
            region: event.target.value,
        });
    }

    render() {
        return (
            <div className="LoginPage flex flex-column align-center grow">
                <div className="title flex align-center">
                    <img className="logo" src={require('../../assets/logo-icon.svg')} alt="logo icon"/>
                    <h1>FIRETEAM.GG</h1>
                </div>

                <div className="sub-title">Find like-minded Overwatch players to improve your skills and climb to Grand Masters.</div>
                <div className="preferences-container card flex flex-column stretch justify-center">
                    <div className="flex justify-center">
                        <h3>Find your Battle.net, PSN, or XBL account</h3>
                    </div>
                    <div className="preference-selectors flex justify-around">
                        <PlatformSelection handleOptionChange={this.onPlatformClick} selectedPlatform={this.state.platform}/>
                        <RegionSelection handleOptionChange={this.onRegionClick} selectedRegion={this.state.region}/>
                    </div>
                </div>
                { this.state.platform === 'pc'
                    ? <BlizzardOAuth region={this.state.region}/>
                    : <ConsoleUserSearch platform={this.state.platform}/>
                }

                <div className="copyright-box">
                    Copyright &copy; Fireteam.gg 2018. All Rights Reserved
                </div>
            </div>
        );
    }
}

LoginPage.propTypes = {
    updateRegionAction: PropTypes.func.isRequired
};

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    updateRegionAction: updateRegionAction,
  }, dispatch);
};

export default connect(null, mapDispatchToProps)(LoginPage);