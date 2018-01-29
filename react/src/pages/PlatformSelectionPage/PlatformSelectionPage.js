import React, {
    Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {updatePlatform as updatePlatformAction} from '../../actions/platform';

class PlatformSelectionPage extends Component {

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(platform) {
        this.props.updatePlatformAction(platform);
    }

    render() {
         return(
            <div className="PlatformSelectionPage">
                <button onClick={() => {this.onClick('pc');}}>PC</button>
                <button onClick={() => {this.onClick('xbl');}}>Xbox</button>
                <button onClick={() => {this.onClick('psn');}}>Play Station</button>
            </div>
        );
    }
}

PlatformSelectionPage.propTypes = {
    updatePlatformAction: PropTypes.func.isRequired
};

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    updatePlatformAction: updatePlatformAction,
  }, dispatch);
};

export default connect(null, mapDispatchToProps)(PlatformSelectionPage);
