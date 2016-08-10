import React, {PropTypes} from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import * as ScheduleState from './ScheduleState';

/**
 * Sample view to demonstrate navigation patterns.
 * @TODO remove this module in a live application.
 */
const ScheduleView = React.createClass({
  propTypes: {
    workouts: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getWeeksRemainingWorkouts() {
    this.props.dispatch(ScheduleState.getWeeksRemainingWorkouts());
  },

  render() {
    return (
      <View style={styles.container} onLayout={this.getWeeksRemainingWorkouts}>
        <Text>
          {JSON.stringify(this.props.workouts[0])}
        </Text>
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

export default ScheduleView;
