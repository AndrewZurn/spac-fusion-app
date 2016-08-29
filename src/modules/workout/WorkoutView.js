import React, {PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import * as WorkoutState from './WorkoutState';
import Colors from '../../utils/colors';
import * as NavigationState from '../../modules/navigation/NavigationState';
import WorkoutCard from '../../components/WorkoutCard';
import * as WorkoutUtils from '../../utils/workoutUtils';

/**
 * @TODO remove this module in a live application.
 */
const WorkoutView = React.createClass({
  propTypes: {
    workouts: PropTypes.array.isRequired,
    remainingWorkoutUnlocks: PropTypes.number.isRequired,
    fusionUser: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getTodaysWorkout() {
    this.props.dispatch(WorkoutState.getTodaysWorkout()); // should set today's workout as head of 'workouts'
  },
  getRemainingWorkoutUnlocks() {
    if (this.props.fusionUser) {
      this.props.dispatch(WorkoutState.getRemainingWorkoutUnlocks(this.props.fusionUser.id));
    }
  },
  setupForWorkout() {
    this.getTodaysWorkout();
    this.getRemainingWorkoutUnlocks();
  },
  setupForWorkoutDetails() {
    this.props.dispatch(WorkoutState.setupForWorkoutDetails(false));
  },
  openWorkoutDetail() {
    let title = WorkoutUtils.getName(this.props.workouts[0]);
    this.props.dispatch(NavigationState.pushRoute({key: 'DetailsForWorkout', title}));
  },

  render() {
    let canUnlockWorkout = this.props.remainingWorkoutUnlocks > 0;

    let workoutCard;
    if (this.props.workouts && this.props.workouts.length > 0) {
      workoutCard = (
          <WorkoutCard workout={this.props.workouts[0]}
                       displayDay={false}
                       displayRightButton={canUnlockWorkout}
                       displayRightButtonText={'Start Workout'}
                       rightButtonAction={() => {
                         this.setupForWorkoutDetails();
                         this.openWorkoutDetail();
                       }}/>
      );
    }

    let remainingWorkoutsText;
    if (this.props.remainingWorkoutUnlocks) {
      remainingWorkoutsText = (
          <Text style={styles.remainingWorkoutsText}>
            Remaining Workout this Week: {this.props.remainingWorkoutUnlocks}
          </Text>
      );
    }

    return (
        <View style={styles.container} onLayout={this.setupForWorkout}>
          {workoutCard}
          {remainingWorkoutsText}
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
  },
  remainingWorkoutsText: {
    fontSize: Colors.textSize,
    color: Colors.spacCream,
    textAlign: 'center',
    fontFamily: Colors.textStyle
  }
});

export default WorkoutView;
