import React, {PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import {Card, Button} from 'react-native-material-design';
import Colors from '../utils/colors';

const WorkoutCard = React.createClass({
  displayName: 'WorkoutCard',
  propTypes: {
    workout: PropTypes.object.isRequired,
    displayDay: PropTypes.bool.isRequired,
    displayButton: PropTypes.bool.isRequired,
    displayButtonText: PropTypes.string,
    buttonAction: PropTypes.func
  },

  render() {
    const workout = this.props.workout;

    let exerciseName = '';
    let description = '';
    let exerciseOptions = [];
    if (workout && workout.exercise) {
      if (workout.exercise.name) {
        exerciseName = workout.exercise.name;
      }

      if (workout.exercise.description) {
        description = workout.exercise.description;
      }

      if (workout.exercise.exerciseOptions) {
        exerciseOptions = workout.exercise.exerciseOptions;
      }
    }

    let duration = '';
    if (workout && workout.duration) { duration = workout.duration; }

    let button;
    if (this.props.displayButton) {
      button = (
          <Card.Actions position='right'>
            <Button text={this.props.displayButtonText} onPress={this.props.buttonAction}/>
          </Card.Actions>
      );
    }

    return (
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Body>
              <Text style={styles.workoutTitle}>{exerciseName}</Text>
              <Text style={styles.text}>Duration: {duration}</Text>
              <Text style={styles.text}>Description: {description}</Text>
              <Text style={styles.text}>Exercises: {exerciseOptions.map(option => option.name).join(', ')}</Text>
            </Card.Body>
            {button}
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
