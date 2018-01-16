import React, {
  Component
} from 'react';

import UserSelector from '../components/UserSelector/UserSelector';

const urlForUserSearch = displayName =>
  `/api/players/search?platformDisplayName=${displayName}`

export default class LoginPage extends Component {
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

        let displayName = this.state.displayName.replace(/#/g, '-');
        fetch(urlForUserSearch(displayName))
            .then(response => {
              if (!response.ok) {
                throw Error("Network request failed")
              }

              return response
            })
            .then(response => response.json())
            .then(response => {
                if(response.length == 0) {
                    this.setState({
                        displayName: '',
                        placeholder: 'No matches found! please try again'
                    })
                } else {
                    this.setState({
                        users: response
                    })
                }
            })
    }

    render() {
        return (
            <div className="LoginPage flex">
            { this.state.users
                ? ( <UserSelector users={this.state.users}/> )
                : ( <div className="input-component skew">
                    <form onSubmit={this.handleSubmit} className="validate">
                        <div className="input-container">
                            <input
                                type="text"
                                value={this.state.displayName}
                                onChange={this.handleChange}
                                placeholder={this.state.placeholder}
                                className="unskew stretch"
                            />
                        </div>
                        <input type="submit" value="Search" className="input-button" disabled={!this.state.displayName} />
                    </form>
                 </div>)
             }
             </div>
        );
    }
}
