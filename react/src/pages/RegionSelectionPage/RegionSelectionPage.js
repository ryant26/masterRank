import React, {
    Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {updateRegion as updateRegionAction} from '../../actions/region';

class RegionSelectionPage extends Component {
    constructor(props) {
        super(props);
    }

    onClick(region) {
        this.props.updateRegionAction(region);
        window.location.assign('/');
    }

    render() {
        return(
            <div className="RegionSelectionPage">
                <button onClick={() => {this.onClick('us');}}>Us</button>
                <button onClick={() => {this.onClick('apac');}}>Asia</button>
                <button onClick={() => {this.onClick('eu');}}>Europe</button>
            </div>
        );
    }
}


RegionSelectionPage.propTypes = {
    updateRegionAction: PropTypes.func.isRequired
};

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    updateRegionAction: updateRegionAction,
  }, dispatch);
};

export default connect(null, mapDispatchToProps)(RegionSelectionPage);