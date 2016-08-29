import {connect} from 'react-redux';
import WorkoutView from './WorkoutView';

export default connect(
    state => ({
      workouts: state.getIn(['workoutState', 'workouts']),
      todaysWorkout: state.getIn(['workoutState', 'todaysWorkout']),
      remainingWorkoutUnlocks: state.getIn(['workoutState', 'remainingWorkoutUnlocks']),
      fusionUser: state.getIn(['auth', 'fusionUser'])
    })
)(WorkoutView);
