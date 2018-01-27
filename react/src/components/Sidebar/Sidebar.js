import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Title from './Title/Title';
import UserCard from '../UserCard/UserCard';
import PreferredHeroes from './PreferredHeroes/PreferredHeroesContainer';
import Invites from './Invites/InvitesContainer';
import Group from './Groups/GroupContainer/GroupContainer';
import SidebarFooter from './sidebar-footer/sidebar-footer';

class Sidebar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Sidebar flex flex-column">
                <div className="header">
                    <Title/>
                </div>
                <div className="body">
                    <UserCard user={this.props.user} />
                    <PreferredHeroes/>
                    <Invites/>
                    <Group />
                </div>
                <div className="footer">
                    <SidebarFooter/>
                </div>
            </div>
        );
    }
}

Sidebar.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = function(state){
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Sidebar);