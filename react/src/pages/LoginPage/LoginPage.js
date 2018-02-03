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
        //TODO: we want region in the store correct? we need it for selection later i believe.
        //TODO: Should i default region to NA?
        //TODO: should we have default platforms and region?
        this.props.updateRegionAction(event.target.value);
        this.setState({
            region: event.target.value,
        });
    }

    render() {
        return (
            <div className="LoginPage">
                <PlatformSelection onClick={this.onPlatformClick}/>
                <RegionSelection onClick={this.onRegionClick}/>
                { this.state.platform === 'pc'
                    ? <BlizzardOAuth region={this.state.region}/>
                    : <ConsoleUserSearch platform={this.state.platform}/>
                }
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