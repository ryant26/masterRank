import React, {
  Component
} from 'react';

import PlayerButton from './PlayerButton/PlayerButton';

export default class withRoutPlayerSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
            { this.props.players.map((player, i) => <PlayerButton player={player} key={i}/>) }
            </div>
        );
    }
}