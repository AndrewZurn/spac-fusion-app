import React, {PropTypes} from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import * as WorkoutState from './WorkoutState';
import Colors from '../../utils/colors';
import * as NavigationState from '../../modules/navigation/NavigationState';
import WorkoutCard from '../../components/WorkoutCard';
import * as WorkoutUtils from '../../utils/workoutUtils';

// TODO: REMOVE ME WHEN HOOKED UP WITH AUTH
const TEST_USER_ID = 'ba729f5c-9781-4d88-bca7-f5098930eff7';

/**
 * @TODO remove this module in a live application.
 */
const WorkoutView = React.createClass({
  propTypes: {
    workouts: PropTypes.array.isRequired,
    canUnlockWorkout: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getTodaysWorkout() {
    this.props.dispatch(WorkoutState._getTodaysWorkout()); // should set today's workout as head of 'workouts'
  },
  canUnlockWorkout() {
    this.props.dispatch(WorkoutState.canUnlockWorkout(TEST_USER_ID));
  },
  setupForWorkout() {
    this._getTodaysWorkout();
    this.canUnlockWorkout(TEST_USER_ID);
  },
  setupForWorkoutDetails() {
    this.props.dispatch(WorkoutState.setupForWorkoutDetails(false));
  },
  openWorkoutDetail() {
    let title = WorkoutUtils.getName(this.props.workouts[0]);
    this.props.dispatch(NavigationState.pushRoute({key: 'DetailsForWorkout', title}));
  },

  render() {
    let workoutCard;
    if (this.props.workouts && this.props.workouts.length > 0) {
      workoutCard = (
        <WorkoutCard workout={this.props.workouts[0]}
                     displayDay={false}
                     extendedExerciseDescription={true}
                     displayRightButton={true}
                     displayRightButtonText={'Start Workout'}
                     rightButtonAction={() => console.log('I\'m Working!!!')}
                     displayLeftButton={true}
                     displayLeftButtonText={'Details'}
                     leftButtonAction={() => {
                       this.setupForWorkoutDetails();
                       this.openWorkoutDetail();
                     }}/>
      );
    }

    return (
      <View style={styles.container} onLayout={this.setupForWorkout}>
        {workoutCard}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.spacMediumGray
  }
});

export default WorkoutView;
