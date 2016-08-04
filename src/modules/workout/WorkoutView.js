import * as WorkoutState from './WorkoutState';
import React, {PropTypes} from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';

/**
 * Sample view to demonstrate navigation patterns.
 * @TODO remove this module in a live application.
 */
const WorkoutView = React.createClass({
  propTypes: {
    exercises: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getWorkouts() {
    this.props.dispatch(WorkoutState.getWorkouts());
  },

  render() {
    const text = `Workout View`;
    const exercises = this.props.exercises;
    return (
      <View style={styles.container}>
        <Text onPress={this.getWorkouts}>
          {text}
        </Text>
        <Text>{JSON.stringify(exercises)}</Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
});

export default WorkoutView;
