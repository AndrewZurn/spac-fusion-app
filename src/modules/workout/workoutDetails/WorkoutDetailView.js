import React, {PropTypes} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text
} from 'react-native';
import {Card, Button} from 'react-native-material-design';
import * as WorkoutState from '../WorkoutState';
import Colors from '../../../utils/colors';
import * as WorkoutUtils from '../../../utils/workoutUtils';

const WorkoutDetailView = React.createClass({
  propTypes: {
    workouts: PropTypes.array,
    isStartingWorkout: PropTypes.bool.isRequired, // is a details view or is a view for the workout in progress
    dispatch: PropTypes.func.isRequired
  },

  render() {
    let workout;
    if (this.props.workouts && this.props.workouts.length > 0) {
      workout = this.props.workouts[0];
    }

    let workoutDescription = WorkoutUtils.getExerciseInstructions(workout);
    let duration = WorkoutUtils.getDuration(workout);

    let exerciseOptionsCards = WorkoutUtils.getExerciseOptions(workout).map(exerciseOption => {
      let alternativeOptionNameText;
      let alternativeOptionDescText;
      let alternativeOptionAmtText;
      if (exerciseOption.alternativeExerciseOption) {
        const alternativeOption = exerciseOption.alternativeExerciseOption;
        const altId = alternativeOption.id;
        alternativeOptionNameText = <Text style={styles.altTitle} key={'name_' + altId}>{'\n'}Alternative: {alternativeOption.name}</Text>;
        alternativeOptionAmtText = <Text style={styles.text} key={'amt_' + altId}>{alternativeOption.targetAmount} {alternativeOption.type}</Text>;

        if (alternativeOption.description) {
          alternativeOptionDescText = <Text style={styles.text} key={'desc_' + altId}>{alternativeOption.description}</Text>;
        }
      }

      let optionId = exerciseOption.id;

      // get the optional description for display if found
      let exerciseOptionDescriptionText;
      if (exerciseOption.description) {
        exerciseOptionDescriptionText = <Text style={styles.text} key={'desc_' + optionId}>{exerciseOption.description}</Text>
      }

      return (
          <Card style={styles.card} key={'card_' + optionId}>
            <Card.Body key={'card_body_' + optionId}>
              <Text style={styles.workoutTitle} key={'name_' + optionId}>{exerciseOption.name}</Text>
              <Text style={styles.text} key={'amt_' + optionId}>{exerciseOption.targetAmount} {exerciseOption.type}</Text>
              {exerciseOptionDescriptionText}
              {alternativeOptionNameText}
              {alternativeOptionAmtText}
              {alternativeOptionDescText}
            </Card.Body>
          </Card>
      );
    });

    return (
        <View style={styles.container} onLayout={this.getWorkout}>
          <Card style={styles.card}>
            <Card.Body>
              <Text style={styles.text}>Duration: {duration}</Text>
              <Text style={styles.text}>Instructions: {workoutDescription}</Text>
            </Card.Body>
          </Card>

          <ScrollView ref='scrollView'
                      keyboardDismissMode='interactive'
                      style={styles.scrollView}>
            {exerciseOptionsCards}
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
  card: {
    backgroundColor: Colors.spacLightGray
  },
  workoutTitle: {
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.spacGold,
    fontFamily: Colors.textStyle
  },
  altTitle: {
    justifyContent: 'center',
    fontSize: Colors.textSize,
    color: Colors.spacGold,
    fontFamily: Colors.textStyle
  },
  text: {
    fontSize: Colors.textSize,
    color: Colors.spacCream,
    fontFamily: Colors.textStyle
  },
  scrollView: {
    flex: 1
  }
});

export default WorkoutDetailView;
