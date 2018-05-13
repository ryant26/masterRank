import React, { Component }from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'components/Modal/Modal';

import { home } from 'components/Routes/links';
import { clearAccessToken } from 'utilities/localStorage/localStorageUtilities';
import { logout as logoutAction } from "actionCreators/app";

import removePlayerAsync from 'api/playerApi/removePlayerAsync';
import removePlayerHeroesAsync from 'api/heroApi/removePlayerHeroesAsync';

class GDPRButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.onGDPR = this.onGDPR.bind(this);
    }

    toggleModal() {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    }

    onGDPR() {
        let accessToken = localStorage.getItem('accessToken');
        Promise.all([removePlayerAsync(accessToken), removePlayerHeroesAsync(accessToken)]);

        this.props.onLogout();
        clearAccessToken();
        window.location.assign(home);
    }
    
    sanitize(displayName) {
        return displayName.replace(/#/g, '-');
    }

    render() {
        return (
            <div className="GDPRButton">
                <a className="gdprButton" onClick={this.toggleModal}>
                    Data
                </a>
                <Modal modalOpen={this.state.modalOpen} closeModal={this.toggleModal}>
                    <div className="GDPRModal">
                        <div className="header flex justify-between align-center">
                            <h3>As a member of the EU, you have</h3>
                        </div>
                        <div className="text-area">
                            <b>Right to Erasure</b> of possible personally identifiable information about you.
                            <br/><br/>
                            Here is what we store:
                            <ul>
                                <li>- Your BattleNet username, platform, and region</li>
                                <li>- All your hero stats (from competitive Overwatch)</li>
                            </ul>
                            <br/>
                            We use this data to create the Fireteam.gg experience. If you do not wish to have this data stored, you may elect to delete the data and logout of the site.
                        </div>
                        <div className="footer flex align-center justify-end">
                            <div className="button-group flex">
                                <div className="button-six flex align-center justify-center" onClick={this.onGDPR}>
                                    <div className="button-content">
                                        Remove Info and Logout
                                    </div>
                                </div>
                                <div className="button-primary flex align-center justify-center" onClick={this.toggleModal}>
                                    <div className="button-content">
                                        Thats Okay
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                
            </div>
        ); 
    }
}

GDPRButton.propTypes = {
    onLogout: PropTypes.func.isRequired
};

const mapDispatchToProps = function(dispatch) {
    return bindActionCreators({
        onLogout: logoutAction
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(GDPRButton);