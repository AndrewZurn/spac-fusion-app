import React, {PropTypes} from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import {Card, Button} from 'react-native-material-design';
import * as WorkoutState from './WorkoutState';
import Colors from '../../utils/colors';
import WorkoutCard from '../../components/WorkoutCard';

// TODO: REMOVE ME WHEN HOOKED UP WITH AUTH
const TEST_USER_ID = 'ba729f5c-9781-4d88-bca7-f5098930eff7';

/**
 * Sample view to demonstrate navigation patterns.
 * @TODO remove this module in a live application.
 */
const WorkoutView = React.createClass({
  propTypes: {
    todaysWorkout: PropTypes.object.isRequired,
    canUnlockWorkout: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getTodaysWorkout() {
    this.props.dispatch(WorkoutState.getTodaysWorkout());
  },
  canUnlockWorkout() {
    this.props.dispatch(WorkoutState.canUnlockWorkout(TEST_USER_ID));
  },
  setupForWorkout() {
    this.getTodaysWorkout();
    this.canUnlockWorkout(TEST_USER_ID);
  },

  render() {
    const workoutCard = (
      <WorkoutCard workout={this.props.todaysWorkout}
                   displayDay={false}
                   displayButton={true}
                   displayButtonText={'Start Workout'}
                   buttonAction={() => console.log('I\'m Working!!!')}/>
    );

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
