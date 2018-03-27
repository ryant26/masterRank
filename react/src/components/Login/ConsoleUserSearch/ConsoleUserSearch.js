import React, {
  Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserSelector from 'components/Login/UserSelector/UserSelector';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { clickConsoleUserSearchTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';

class ConsoleUserSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            placeholder: 'Enter your PSN, or Xbox gamertag',
            lastSearch: '',
            isSearching: false,
        };

        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentWillReceiveProps() {
        this.setState({
            users: undefined,
        });
    }

    handleChange(event) {
        this.setState({displayName: event.target.value});
    }

    onClick() {
        let query = this.state.displayName;
        this.props.dispatchClickConsoleUserSearchTrackingEvent(query);
        this.setState({
            isSearching: true,
            lastSearch: query,
            users: undefined
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch(this.urlForUserSearch(this.state.displayName))
            .then(response => {
              if (!response.ok && response.status !== 304) {
                throw Error("Network request failed");
              }

              return response;
            })
            .then(response => response.json())
            .then(users => {
                if(users.length == 0) {
                    this.setState({
                        displayName: '',
                        placeholder: 'No matches found! please try again',
                        isSearching: false,
                    });
                } else {
                    this.setState({
                        users: users,
                        isSearching: false,
                    });
                }
            }).catch((error) => {
                throw error;
            });
    }

    urlForUserSearch(displayName) {
        return `/api/players/search?platformDisplayName=${this.sanitize(displayName)}&platform=${this.props.platform}`;
    }

    sanitize(displayName) {
        return displayName.replace(/#/g, '-');
    }

    render() {
        return (
            <div className="ConsoleUserSearch flex flex-column stretch-self stretch grow">
                <div className="flex justify-center">
                    <div className="input-component grow">
                        <form onSubmit={this.handleSubmit} className="flex grow">
                            <div className="input-container flex grow">
                                <input
                                    type="text"
                                    name="userSearch"
                                    value={this.state.displayName}
                                    onChange={this.handleChange}
                                    placeholder={this.state.placeholder}
                                    className="button-content grow"
                                />
                            </div>
                            <button
                                type="submit"
                                className="button-primary"
                                onClick={this.onClick}
                                disabled={!this.state.displayName}
                            >
                                <div className="button-content">
                                    SEARCH
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
                <div className="flex flex-column results-area grow">
                    { this.state.isSearching &&
                        <div className="flex flex-column align-center justify-center grow">
                            <LoadingSpinner/>
                        </div>
                    }
                    { this.state.users && (
                        <div className="flex flex-column grow">
                            <h3>Results for: {this.state.lastSearch}</h3>
                            <UserSelector users={this.state.users}/>
                        </div>
                    )}
                    { !this.state.users && !this.state.isSearching && this.state.lastSearch && (
                        <div className="flex flex-column grow">
                            <h3>No Results for: {this.state.lastSearch}</h3>
                            <ul className="search-hints">
                                <li>We couldnt find any results for your search.</li>
                                <li>Please make sure that you enter your full Battletag, PSN ID, or Xbox Gamertag.</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

ConsoleUserSearch.propTypes = {
    platform: PropTypes.string.isRequired,
    dispatchClickConsoleUserSearchTrackingEvent: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        dispatchClickConsoleUserSearchTrackingEvent: clickConsoleUserSearchTrackingEvent
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(ConsoleUserSearch);