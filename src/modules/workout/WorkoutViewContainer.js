import {connect} from 'react-redux';
import WorkoutView from './WorkoutView';

export default connect(
    state => ({
      workouts: state.getIn(['workoutState', 'workouts']),
      todaysWorkout: state.getIn(['workoutState', 'todaysWorkout']),
      canUnlockWorkout: state.getIn(['workoutState', 'canUnlockWorkout'])
    })
)(WorkoutView);
