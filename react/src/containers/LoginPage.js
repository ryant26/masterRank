import React, {
  Component
} from 'react';

import PlayerCard from '../components/Sidebar/PlayerCard/PlayerCard';

//TODO: Remove before submitting PR
import * as users from '../resources/users';

// TODO: Are we going to set up a proxy or does the 3003 port have to be hardcoded?
const urlForPlayerSearch = displayName =>
  `http://localhost:3003/api/players/search?platformDisplayName=${displayName}`

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

//    componentDidMount() {
//        fetch(urlForPlayerSearch("luckybomb-1470"))
//              .then(response => {
//                if (!response.ok) {
//                  throw Error("Network request failed")
//                }
//
//                return response
//              })
//              .then(response => response.json())
//              .then(response => {
//                this.setState({
//                  user: {
//                        platformDisplayName: response.platformDisplayName,
//                        platform: response.platform,
//                        portrait: response.portrait,
//                        level: response.level
//                      }
//                })
//              })
//    }

    handleSubmit(event) {
//        fetch(urlForPlayerSearch("luckybomb-1470"))
//        fetch(urlForPlayerSearch(this.state.displayName))
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
//              user: {
//                        platformDisplayName: response.platformDisplayName,
//                        platform: response.platform,
//                        portrait: response.portrait,
//                        level: response.level
//                      }
//            })
//          })

        this.setState({
            user: {
              platformDisplayName: "Luckybomb-1470",
              platform: 'pc',
              portrait: 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000005A3.png',
              level: '517',
//              skillRating: '3200'
            }
         })
        //redirect to homepage
//        this.props.history.push("/");
    }

    render() {
        return (
            <div className="container-md flex">
            { this.state.user
                ? (<PlayerCard user={this.state.user}/>)
                : (<div className="input-component skew">
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