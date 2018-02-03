import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

import UserSelector from '../UserSelector/UserSelector';

export default class ConsoleUserSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            placeholder: 'Enter Full Battletag, PSN, or Xbox Gamertag...'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({displayName: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch(this.urlForUserSearch(this.state.displayName))
            .then(response => {
              if (!response.ok) {
                throw Error("Network request failed");
              }

              return response;
            })
            .then(response => response.json())
            .then(response => {
                if(response.length == 0) {
                    this.setState({
                        displayName: '',
                        placeholder: 'No matches found! please try again'
                    });
                } else {
                    this.setState({
                        users: response
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
            <div className="ConsoleUserSearch flex">
                <div className="input-component skew">
                    <form onSubmit={this.handleSubmit} className="validate">
                        <div className="input-container">
                            <input
                                type="text"
                                value={this.state.displayName}
                                onChange={this.handleChange}
                                placeholder={this.state.placeholder}
                                className="unskew stretch"
                            />
                            <input type="submit" value="Search" className="input-button" disabled={!this.state.displayName} />
                        </div>
                    </form>
                    { this.state.users && ( <UserSelector users={this.state.users}/> )}
                 </div>
            </div>
        );
    }
}

ConsoleUserSearch.propTypes = {
    platform: PropTypes.string.isRequired,
};