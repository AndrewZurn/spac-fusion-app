import {connect} from 'react-redux';
import WorkoutView from './WorkoutView';

export default connect(
    state => ({
      exercises: state.getIn(['workoutState', 'exercises'])
    })
)(WorkoutView);
