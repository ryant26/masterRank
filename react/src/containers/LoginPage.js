import React, {
  Component
} from 'react';


export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleChange(event) {
        this.setState({value: event.target.value});
      }

      handleSubmit(event) {
        alert('Battletag: ' + this.state.value);
        event.preventDefault();
      }

      render() {
        return (
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
        );
    }
}