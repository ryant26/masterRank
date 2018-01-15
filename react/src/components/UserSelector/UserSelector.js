import React, {
  Component
} from 'react';

import UserButton from './UserButton/UserButton';

export default class UserSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                { this.props.users.map((user, i) =>
                    <UserButton
                        user={user}
                        updateUserAction={this.props.updateUserAction}
                        key={i}
                    />)
                }
            </div>
        );
    }
}