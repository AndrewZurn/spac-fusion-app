import {connect} from 'react-redux';
import WorkoutDetailsView from './WorkoutDetailView';

export default connect(
    state => ({
      workouts: state.getIn(['workoutState', 'workouts']),
      isStartingWorkout: state.getIn(['workoutState', 'isStartingWorkout'])
    })
)(WorkoutDetailsView);
