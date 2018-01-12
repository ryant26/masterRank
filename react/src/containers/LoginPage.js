import React, {
  Component
} from 'react';

import PlayerCard from '../components/Sidebar/PlayerCard/PlayerCard';

//TODO: Remove before submitting PR
import * as users from '../resources/users';

const urlForPlayerInfo = battletag =>
  `http://localhost:3003/api/players/search?platformDisplayName=${battletag}`

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            battletag: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({battletag: event.target.value});
    }

    handleSubmit(event) {
        //Query player using /api/player/search
//        fetch(urlForPlayerInfo(this.state.battletag))
//          .then(response => {
//            if (!response.ok) {
//              throw Error("Network request failed")
//            }
//
//            return response
//          })
//          .then(response => response.json())
//          .then(response => {
//            this.setState({
//              user: response
//            })
//          })
//        Check if valid use is retured
        let user = users.users[0];
        user.platformDisplayName = this.state.battletag;
        this.setState({
            user: user
        });

        //redirect to homepage
        this.props.history.push("/");
    }

    render() {
        if(this.state.user){
            return (
                <PlayerCard user={this.state.user}/>
            );
        } else {
            return (
                <div className="body">
                  <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        value={this.state.battletag}
                        onChange={this.handleChange}
                        placeholder="Enter Full Battletag, PSN, or Xbox Gamertag..."
                        className="input-primary"
                    />
                    <input type="submit" value="Search" className="button-primary" />
                  </form>
                </div>
            );
        }
    }
}