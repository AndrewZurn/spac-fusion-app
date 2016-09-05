import React, {PropTypes} from 'react';
import {
    Dimensions,
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    Text
} from 'react-native';
import {Card, Button} from 'react-native-material-design';
import Colors from '../../../utils/colors';
import RadioButton from 'react-native-radio-button';
import * as WorkoutState from '../WorkoutState';
import * as WorkoutUtils from '../../../utils/workoutUtils';

const width = Dimensions.get('window').width;

const WorkoutDetailView = React.createClass({
  propTypes: {
    workouts: PropTypes.array,
    isStartingWorkout: PropTypes.bool.isRequired, // is a details view or is a view for the workout in progress
    dispatch: PropTypes.func.isRequired
  },
  getInitialState() {
    return {
      selectedExercises: this._setupSelectedExercises() // should be an {exerciseOptionId, isSelected, {exerciseOptionId, isSelected}}
    };
  },

  _setupSelectedExercises() {
    let workout = this.props.workouts[0];
    return WorkoutUtils.getExerciseOptions(workout).map(exerciseOption => {
      let altExerciseOptionId;
      if (exerciseOption.alternativeExerciseOption) {
        altExerciseOptionId = exerciseOption.alternativeExerciseOption.id;
      }

      return {
        exerciseOptionId: exerciseOption.id,
        alternativeIsSelected: false,
        altExerciseOptionId
      };
    });
  },

  _exerciseOptionIsSelected(exerciseOptionId) {
    return this.state.selectedExercises
        .find(option => option.exerciseOptionId === exerciseOptionId)
        .alternativeIsSelected;
  },

  /**
   * Will find the exerciseOption for the card that was selected, and update which of the option's is
   * in the selected position.
   *
   * @param exerciseOptionId The exercise option/parent of alternative option whose radio button was selected.
   * @param alternativeIsSelected Flag for whether it was the alternative option that was selected or not.
   * @private
   */
  _updateSelectedExerciseOption(exerciseOptionId, alternativeIsSelected) {
    let updatedSelectedExercises = this.state.selectedExercises.map(option => {
      if (option.exerciseOptionId === exerciseOptionId) {
        return {
          exerciseOptionId,
          alternativeIsSelected: alternativeIsSelected,
          altExerciseOptionId: option.altExerciseOptionId
        };
      } else {
        return option;
      }
    });

    this.setState({...this.state, selectedExercises: updatedSelectedExercises});
  },

  _createAlternativeOptionCard(exerciseOption, optionId) {
    let alternativeOptionView;
    if (exerciseOption.alternativeExerciseOption) {
      const alternativeOption = exerciseOption.alternativeExerciseOption;
      const altId = alternativeOption.id;

      let alternativeOptionDescText = this._getExerciseOptionDescription(alternativeOption, altId);

      alternativeOptionView = (
          <View style={{flexDirection: 'row'}}>
            <View style={[{flexDirection: 'column'}]}>
              <View style={styles.radioButtonCentered}>
                <RadioButton
                    key={'radio_button_alt_' + optionId}
                    animation={'bounceIn'}
                    size={14}
                    isSelected={this._exerciseOptionIsSelected(exerciseOption.id)} // alternativeIsSelected must be true
                    onPress={() => this._updateSelectedExerciseOption(exerciseOption.id, true)}
                />
              </View>
            </View>
            <View style={[{flexDirection: 'column'}]}>
              <Text style={styles.altTitle} key={'name_' + altId}>Alternative: {alternativeOption.name}</Text>
              <Text style={styles.text}
                    key={'amt_' + altId}>{alternativeOption.targetAmount} {alternativeOption.type}</Text>
              {alternativeOptionDescText}
            </View>
          </View>
      );
    }

    return alternativeOptionView;
  },

  _getExerciseOptionDescription(exerciseOption, optionId) {
    if (exerciseOption.description) {
      return <Text style={styles.text} key={'desc_' + optionId}>{exerciseOption.description}</Text>;
    }
    return null;
  },

  render() {
    let workout;
    if (this.props.workouts && this.props.workouts.length > 0) {
      workout = this.props.workouts[0];
    }

    let duration = WorkoutUtils.getDuration(workout);
    let workoutDescription = WorkoutUtils.getExerciseInstructions(workout);

    // create views for the selected options
    let exerciseOptionsCards = WorkoutUtils.getExerciseOptions(workout).map(exerciseOption => {
      let optionId = exerciseOption.id;

      // create alternative exercise option view
      let alternativeOptionView = this._createAlternativeOptionCard(exerciseOption, optionId);

      // get the optional description for display if found
      let exerciseOptionDescriptionText = this._getExerciseOptionDescription(exerciseOption, optionId);

      return (
          <Card style={styles.card} key={'card_' + optionId}>
            <Card.Body key={'card_body_' + optionId}>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <View style={[{flexDirection: 'column'}]}>
                  <View style={styles.radioButtonCentered}>
                    <RadioButton
                        key={'radio_button_' + optionId}
                        animation={'bounceIn'}
                        size={14}
                        isSelected={!this._exerciseOptionIsSelected(exerciseOption.id)} // alternativeIsSelected must be false
                        onPress={() => this._updateSelectedExerciseOption(exerciseOption.id, false)}
                    />
                  </View>
                </View>
                <View style={[{flexDirection: 'column'}]}>
                  <Text style={styles.workoutTitle} key={'name_' + optionId}>{exerciseOption.name}</Text>
                  <Text style={styles.text}
                        key={'amt_' + optionId}>{exerciseOption.targetAmount} {exerciseOption.type}</Text>
                  {exerciseOptionDescriptionText}
                </View>
              </View>
              {alternativeOptionView}

              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <View style={styles.textInputParent}>
                  <TextInput
                      style={[styles.textInput]}
                      keyboardType='numeric'
                      onEndEditing={() => console.log('or im here') }
                      onChangeText={(text) => console.log('im here') }
                      placeholder='Enter Results'
                      placeholderTextColor={Colors.spacGold}
                      value={0}/>
                </View>
              </View>
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
  radioButtonCentered: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10
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
  textInput: {
    textAlign: 'center',
    height: 35,
    width: width * 0.38,
    backgroundColor: Colors.spacLightGray,
    color: Colors.spacGold,
    fontFamily: Colors.textStyle
  },
  textInputParent: {
    width: width * 0.38,
    borderBottomColor: Colors.spacGold,
    borderBottomWidth: 1
  },
  scrollView: {
    flex: 1
  }
});

export default WorkoutDetailView;
