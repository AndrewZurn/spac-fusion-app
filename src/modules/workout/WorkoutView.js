import React, {PropTypes} from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import { Card, Button } from 'react-native-material-design';
import * as WorkoutState from './WorkoutState';
import Colors from '../../utils/colors';

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
    const todaysWorkout = this.props.todaysWorkout;
    const exercise = todaysWorkout.exercise;

    let exerciseName;
    if (exercise && exercise.name) { exerciseName = exercise.name; } else { exerciseName = ''; }

    let duration;
    if (todaysWorkout.duration) { duration = todaysWorkout.duration; } else { duration = ''; }

    return (
      <View style={styles.container} onLayout={this.setupForWorkout}>
        <Card style={styles.card}>
          <Card.Body>
            <Text style={styles.workoutTitle}>{exerciseName}</Text>
            <Text style={styles.text}>Duration: {duration}</Text>
          </Card.Body>
          <Card.Actions position="right">
            <Button text="Start Workout" />
          </Card.Actions>
        </Card>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.spacMediumGray,
  },
  card: {
    backgroundColor: Colors.spacLightGray
  },
  workoutTitle: {
    justifyContent: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.spacCream
  },
  text: {
    fontSize: 16,
    color: Colors.spacCream
  }
});

export default WorkoutView;
