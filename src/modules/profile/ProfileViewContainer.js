import {connect} from 'react-redux';
import ProfileView from './ProfileView';

export default connect(
    state => ({
      fusionUser: state.getIn(['profileState', 'fusionUser']),
      completedWorkouts: state.getIn(['profileState', 'completedWorkouts']),
      auth0User: state.getIn(['auth', 'currentUser'])
    })
)(ProfileView);
