import React, {
  Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PlatformSelection from 'components/Login/PlatformSelection/PlatformSelection';
import RegionSelection from 'components/Login/RegionSelection/RegionSelection';
import FullPageLoadingSpinner from 'components/LoadingSpinner/FullPageLoadingSpinner';
import ConsoleUserSearch from 'components/Login/ConsoleUserSearch/ConsoleUserSearch';
import BlizzardOAuth from 'components/Login/BlizzardOAuth/BlizzardOAuth';
import {updateRegion as updateRegionAction} from 'actionCreators/region';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            platform: 'pc',
            region: 'us',
            checked: false
        };
        this.props.updateRegionAction(this.state.region);

        this.onPlatformChange = this.onPlatformChange.bind(this);
        this.onRegionChange = this.onRegionChange.bind(this);
        this.onCheckedChange = this.onCheckedChange.bind(this);
    }

    onPlatformChange(event) {
        this.setState({
            platform: event.target.value,
        });
    }

    onRegionChange(event) {
        this.props.updateRegionAction(event.target.value);
        this.setState({
            region: event.target.value,
        });
    }

    onCheckedChange() {
        this.setState({
            checked: !this.state.checked
        });
    }

    render() {
        return (
            <div className="LoginPage flex flex-column align-center grow">
                <div className="background">
                    <img src={require('assets/home-bg.jpg')}/>
                </div>
                <div className="title flex align-center">
                    <img className="logo" src={require('assets/logo-icon.png')} alt="logo icon"/>
                    <h1>FIRETEAM.GG</h1>
                </div>

                <div className="info-line sub-title">Find like-minded Overwatch players to improve your skills and climb to Grand Masters.</div>
                <div className="preferences-container card flex flex-column stretch justify-center">
                    <div className="flex justify-center">
                        <h3>Find your Battle.net, PSN, or XBL account</h3>
                    </div>
                    <div className="preference-selectors flex justify-around">
                        <div className="platform-selection">
                            <div className="sub-title selector-label">Platform:</div>
                            <PlatformSelection onChange={this.onPlatformChange} selectedPlatform={this.state.platform}/>
                        </div>
                        <div className="region-selection ">
                            <div className="sub-title selector-label">Region:</div>
                            <RegionSelection onChange={this.onRegionChange} selectedRegion={this.state.region}/>
                        </div>
                    </div>
                </div>
                { this.state.region === 'eu' &&  
                    <div ref="GDPRArea" className="gdpr-container sub-title card flex align-center">
                        <div className="flex gdpr-checkbox">
                            <input type="checkbox" checked={this.state.checked} onChange={this.onCheckedChange}/>
                            <label className="gdpr-label">As a member of the EU, by logging in, you are agreeing to having information related to your battlenet account stored and used for the site experience (player and hero stats).</label>
                        </div>
                        <br/>
                    </div>
                }
                { this.state.platform === 'pc'
                    ? <BlizzardOAuth region={this.state.region} platform={this.state.platform} disabled={!this.state.checked && this.state.region === 'eu'}/>
                    : <ConsoleUserSearch platform={this.state.platform} region={this.state.region} disabled={!this.state.checked && this.state.region === 'eu'}/>
                }
                <FullPageLoadingSpinner/>
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