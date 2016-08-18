import React, {PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import {Card, Button} from 'react-native-material-design';
import Colors from '../utils/colors';
import * as WorkoutUtils from '../utils/workoutUtils';

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

    let exerciseNameText = WorkoutUtils.getName(workout);
    let descriptionText = WorkoutUtils.getDescription(workout);

    let exerciseOptionsText = '';
    let exerciseOptions = WorkoutUtils.getExerciseOptionsText(workout, this.props.extendedExerciseDescription);
    if (exerciseOptions && exerciseOptions.length > 0) {
      // if extended exercise description, drop exercise options onto new line and tab for each
      if (this.props.extendedExerciseDescription) {
        descriptionText += '\n';
        exerciseOptionsText = NEW_LINE_TAB_CHARS + exerciseOptions.join(NEW_LINE_TAB_CHARS);
      } else {
        exerciseOptionsText = exerciseOptions.join(', ');
      }
    }

    let durationText = WorkoutUtils.getDuration(workout);

    let rightButton;
    if (this.props.displayRightButton) {
      rightButton = <Button text={this.props.displayRightButtonText} onPress={this.props.rightButtonAction}/>;
    }

    let leftButton;
    if (this.props.displayLeftButton) {
      leftButton = <Button text={this.props.displayLeftButtonText} onPress={this.props.leftButtonAction}/>;
    }

    let dayText = '';
    if (this.props.displayDay) {
      dayText = WorkoutUtils.getDay(workout);
    }

    return (
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Body>
              <Text style={styles.text}>{dayText}</Text>
              <Text style={styles.workoutTitle}>{exerciseNameText}</Text>
              <Text style={styles.text}>{durationText}</Text>
              <Text style={styles.text}>{descriptionText}</Text>
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
