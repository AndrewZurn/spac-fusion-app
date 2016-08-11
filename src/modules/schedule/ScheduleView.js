import React, {PropTypes} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text
} from 'react-native';
import * as ScheduleState from './ScheduleState';
import WorkoutCard from '../../components/WorkoutCard';
import Colors from '../../utils/colors';

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
    let workoutCard = this.props.workouts.map((workout, index) => {
      return <WorkoutCard
                key={'workout-card-' + index}
                workout={workout}
                displayDay={true}
                displayButton={false}
                extendedExerciseDescription={false}/>;
    });

    let remainingWorkoutsText = '';
    let remainingWorkoutsCount = this.props.workouts.length;
    if (remainingWorkoutsCount > 0) {
      remainingWorkoutsText = `Remaining Workouts this Week: ${remainingWorkoutsCount}`;
    }

    return (
      <View style={styles.container} onLayout={this.getWeeksRemainingWorkouts}>
        <Text style={styles.remainingWorkoutsText}>{remainingWorkoutsText}</Text>
        <ScrollView ref='scrollView'
                    keyboardDismissMode='interactive'
                    style={styles.scrollView}>
          {workoutCard}
        </ScrollView>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: Colors.spacMediumGray
  },
  remainingWorkoutsText: {
    fontSize: 16,
    color: Colors.spacCream,
    textAlign: 'center'
  },
  scrollView: {
    flex: 1,
    margin: 5
  }
});

export default ScheduleView;
