import React, {PropTypes} from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';

import * as NavigationState from '../../modules/navigation/NavigationState';
import '../../services/workoutService';

/**
 * Sample view to demonstrate navigation patterns.
 * @TODO remove this module in a live application.
 */
const CalendarView = React.createClass({
  propTypes: {
    index: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired
  },

  getInitialState() {
    return {

    };
  },

  onNextPress() {
    const index = this.props.index;
    this.props.dispatch(NavigationState.pushRoute({key: `Workout_${index + 1}`}));
  },

  render() {
    const text = 'Calendar View';
    return (
      <View style={styles.container}>
        <Text onPress={this.onNextPress}>
          {text}
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

export default CalendarView;
