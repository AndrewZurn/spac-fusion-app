import React, {PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import moment from 'moment';
import {Card, Button} from 'react-native-material-design';
import Colors from '../utils/colors';

const NEW_LINE_TAB_CHARS = '\n\t - ';

const WorkoutCard = React.createClass({
  displayName: 'WorkoutCard',
  propTypes: {
    workout: PropTypes.object.isRequired,
    displayDay: PropTypes.bool.isRequired,
    extendedExerciseDescription: PropTypes.bool.isRequired,
    displayRightButton: PropTypes.bool.isRequired,
    displayRightButtonText: PropTypes.string,
    rightButtonAction: PropTypes.func,
    displayLeftButton: PropTypes.bool.isRequired,
    displayLeftButtonText: PropTypes.string,
    leftButtonAction: PropTypes.func
  },

  render() {
    const workout = this.props.workout;

    let exerciseNameText = '';
    let descriptionText = '';
    let exerciseOptionsText = '';
    if (workout && workout.exercise) {
      if (workout.exercise.name) {
        exerciseNameText = workout.exercise.name;
      }

      if (workout.exercise.description) {
        descriptionText = workout.exercise.description;
      }

      if (workout.exercise.exerciseOptions) {
        if (this.props.extendedExerciseDescription) {
          descriptionText += '\n';

          // if extended exercise description, drop exercise options onto new line and tab for each
          exerciseOptionsText = NEW_LINE_TAB_CHARS + workout.exercise.exerciseOptions.map(option => {
            return `${option.name} - ${option.targetAmount} ${option.type}`;
          }).join(NEW_LINE_TAB_CHARS);
        } else {
          exerciseOptionsText = workout.exercise.exerciseOptions.map(option => option.name).join(', ');
        }
      }
    }

    let durationText = '';
    if (workout && workout.duration) { durationText = workout.duration; }

    let rightButton;
    if (this.props.displayRightButton) {
      rightButton = <Button text={this.props.displayRightButtonText} onPress={this.props.rightButtonAction}/>;
    }

    let leftButton;
    if (this.props.displayLeftButton) {
      leftButton = <Button text={this.props.displayLeftButtonText} onPress={this.props.leftButtonAction}/>;
    }

    let dayText = '';
    if (this.props.displayDay && workout && workout.workoutDate) {
      dayText = moment(workout.workoutDate).format('dddd');
    }

    return (
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Body>
              <Text style={styles.text}>{dayText}</Text>
              <Text style={styles.workoutTitle}>{exerciseNameText}</Text>
              <Text style={styles.text}>Duration: {durationText}</Text>
              <Text style={styles.text}>Description: {descriptionText}</Text>
              <Text style={styles.text}>Exercises: {exerciseOptionsText}</Text>
            </Card.Body>
            <Card.Actions position='right'>
              {leftButton}
              {rightButton}
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
    backgroundColor: Colors.spacMediumGray
  },
  card: {
    backgroundColor: Colors.spacLightGray
  },
  workoutTitle: {
    justifyContent: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.spacGold,
    paddingBottom: 5
  },
  text: {
    fontSize: 16,
    color: Colors.spacCream
  }
});

export default WorkoutCard;
