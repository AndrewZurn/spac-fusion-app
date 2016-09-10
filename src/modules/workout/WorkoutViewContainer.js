import {connect} from 'react-redux';
import WorkoutView from './WorkoutView';

export default connect(
    state => ({
      workouts: state.getIn(['workoutState', 'workouts']),
      todaysWorkout: state.getIn(['workoutState', 'todaysWorkout']),
      remainingWorkoutUnlocks: state.getIn(['workoutState', 'remainingWorkoutUnlocks']),
      completedWorkout: state.getIn(['workoutState', 'completedWorkout']),
      didSaveCompletedWorkout: state.getIn(['workoutState', 'didSaveCompletedWorkout']),
      fusionUser: state.getIn(['auth', 'fusionUser'])
    })
)(WorkoutView);
