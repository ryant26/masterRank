import React, {
  Component
} from 'react';

import PlayerCard from '../components/Sidebar/PlayerCard/PlayerCard';

//TODO: Remove before submitting PR
import * as users from '../resources/users';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        try {
            //Query player using /api/player/search
            //Check if valid use is retured
            let user = users.users[0];
            user.platformDisplayName = this.state.value;
            this.setState({
                user: user
            });
            //redirect to homepage
            this.props.history.push("/");
        } catch(e) {
            alert(e);
        }
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
                        value={this.state.value}
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