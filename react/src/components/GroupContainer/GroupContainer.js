import React, {
    Component
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Model from '../../model/model';

class GroupContainer extends Component {

    constructor(props) {
        super(props);

        let displayName = this.props.user.platformDisplayName;
    }

    //TODO: CRUD for group
    componentWillMount() {
//        Model.createNewGroup(this.props.preferredHeroes.heroes[0]);
    }

    render() {
        return (
            <div className="GroupContainer">
             <div>==================================</div>
                {

                    this.props.group.leader.platformDisplayName

                }
             <div>==================================</div>
            </div>
        );
    }
};

GroupContainer.propTypes = {
    group: PropTypes.shape({
        groupId: PropTypes.number,
        members: PropTypes.array,
        pending: PropTypes.array,
        leader: PropTypes.shape({
            heroName: PropTypes.string,
            platformDisplayName: PropTypes.string,
            skillRating: PropTypes.number,
            stats: PropTypes.object,
        }),
    }),
    preferredHeroes: PropTypes.shape({
        heroes: PropTypes.array
    }).isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
      group: state.group,
      preferredHeroes: state.preferredHeroes,
      user: state.user
    };
};

export default connect(mapStateToProps)(GroupContainer);