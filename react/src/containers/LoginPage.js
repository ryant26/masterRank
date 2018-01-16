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
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({displayName: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        //TODO: Handle no users retured
        //TODO: How do people feel about moving dashboard and login to a pages folder?
        //TODO: Replace # with - in the api query
        //TODO: Limit returned users
        fetch(urlForUserSearch(this.state.displayName))
            .then(response => {
            //TODO: how should we handle 304?
              if (!response.ok || response.status == '304') {
                throw Error("Network request failed")
              }

              return response
            })
            .then(response => response.json())
            .then(response => {
              this.setState({
                users: response
              })
            })
    }

    render() {
        return (
            <div className="container-md flex">
            { this.state.users
                ? ( <UserSelector users={this.state.users} updateUserAction={this.props.updateUserAction}/> )
                : ( <div className="input-component skew">
                    <form onSubmit={this.handleSubmit} className="validate">
                        <div className="input-container">
                            <input
                                type="text"
                                value={this.state.displayName}
                                onChange={this.handleChange}
                                placeholder="Enter Full Battletag, PSN, or Xbox Gamertag..."
                                className="unskew stretch"
                            />
                        </div>
                        <input type="submit" value="Search" className="input-button" />
                    </form>
                 </div>)
             }
             </div>
        );
    }
}
