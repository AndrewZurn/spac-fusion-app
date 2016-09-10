import React, {PropTypes} from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    ScrollView,
    TextInput,
    Text,
    View
} from 'react-native';
import {Card, Button} from 'react-native-material-design';
import Colors from '../../../utils/colors';
import Picker from 'react-native-picker';
import RadioButton from 'react-native-radio-button';
import * as WorkoutState from '../WorkoutState';
import * as WorkoutUtils from '../../../utils/workoutUtils';
import * as NavigationState from '../../navigation/NavigationState';

const BusyIndicator = require('react-native-busy-indicator');
const loaderHandler = require('react-native-busy-indicator/LoaderHandler');
const width = Dimensions.get('window').width;
const EXERCISE_OPTION_INPUT_WIDTH = 0.87;

const MINUTE_TEXT_VALUE = 'Minute';
const SECOND_TEXT_VALUE = 'Second';
const MINUTES_TEXT_VALUE = 'Minutes';
const SECONDS_TEXT_VALUE = 'Seconds';

const WorkoutDetailView = React.createClass({
  propTypes: {
    workouts: PropTypes.array,
    // is a details view or is a view for the workout in progress
    isStartingWorkout: PropTypes.bool.isRequired,
    fusionUser: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    saveCompletedWorkoutErrors: PropTypes.array.isRequired,
    didSaveCompletedWorkout: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getInitialState() {
    return {
      // should be an {exerciseOptionId, isSelected, {exerciseOptionId, isSelected}}
      selectedExercises: this._setupSelectedExercises(),
      timedExerciseOptionIdBeingEdited: null
    };
  },
  _displayLoadingIndicatorWhenLoading() {
    if (this.props.loading) {
      loaderHandler.showLoader('Loading');
    } else {
      loaderHandler.hideLoader();
    }
  },
  _closeViewIfWorkoutSuccessfullySaved() {
    if (this.props.didSaveCompletedWorkout) {
      Alert.alert(
          'Your Workout Was Saved',
          'You can view completed workouts from your profile, or adjust ' +
          'today\'s workout by going to the \'Workout\' tab.',
          [{text: 'OK', onPress: () => this.props.dispatch(NavigationState.popRoute()) }]
      );
    }
  },
  _saveCompletedWorkout(completedExerciseResults) {
    let workoutId = this._getWorkoutFromProps().id;
    let userId = this.props.fusionUser.id;
    this.props.dispatch(WorkoutState.saveCompletedWorkout(completedExerciseResults, userId, workoutId));
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
        altExerciseOptionId,
        displayValue: null,
        value: null
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
   * @param exerciseOptionId {uuid} The exercise option/parent of alternative option whose radio button was selected.
   * @param alternativeIsSelected {boolean} Flag for whether it was the alternative option that was selected or not.
   * @private
   */
  _updateSelectedExerciseOption(exerciseOptionId, alternativeIsSelected) {
    let updatedSelectedExercises = this.state.selectedExercises.map(option => {
      if (option.exerciseOptionId === exerciseOptionId) {
        return {
          ...option,
          exerciseOptionId,
          alternativeIsSelected
        };
      } else {
        return option;
      }
    });

    this.setState({...this.state, selectedExercises: updatedSelectedExercises});
  },

  _getExerciseOptionAmount(exerciseOption) {
    if (exerciseOption.targetAmount) {
      return exerciseOption.targetAmount;
    } else if (exerciseOption.duration) {
      return exerciseOption.duration;
    } else {
      return '';
    }
  },

  _getExerciseOptionDescriptionText(exerciseOption, optionId) {
    return exerciseOption.description
        ? <Text style={styles.text} key={'desc_' + optionId}>{exerciseOption.description}</Text> : null;
  },

  _createAlternativeOptionCard(exerciseOption, optionId) {
    let alternativeOptionView;
    if (exerciseOption.alternativeExerciseOption) {
      const alternativeOption = exerciseOption.alternativeExerciseOption;
      const altId = alternativeOption.id;

      let alternativeOptionDescText = this._getExerciseOptionDescriptionText(alternativeOption, altId);
      let amount = this._getExerciseOptionAmount(alternativeOption);

      alternativeOptionView = (
          <View style={{flexDirection: 'row'}}>
            <View style={[{flexDirection: 'column'}]}>
              <View style={styles.radioButtonCentered}>
                <RadioButton
                    key={'radio_button_alt_' + optionId}
                    animation={'bounceIn'}
                    size={14}
                    // the user has selected the alternative option
                    isSelected={this._exerciseOptionIsSelected(exerciseOption.id)}
                    onPress={() => this._updateSelectedExerciseOption(exerciseOption.id, true)}
                />
              </View>
            </View>
            <View style={[{flexDirection: 'column'}]}>
              <Text style={styles.altTitle} key={'name_' + altId}>Alternative: {alternativeOption.name}</Text>
              <Text style={styles.text}
                    key={'amt_' + altId}>{alternativeOption.type} - {amount}</Text>
              {alternativeOptionDescText}
            </View>
          </View>
      );
    }

    return alternativeOptionView;
  },

  _getExerciseOption(exerciseOptionId) {
    return this.state.selectedExercises.find(option => option.exerciseOptionId === exerciseOptionId);
  },

  _getExerciseOptionDisplayValue(exerciseOptionId) {
    let foundOption = this._getExerciseOption(exerciseOptionId);
    return foundOption && foundOption.displayValue ? foundOption.displayValue : '';
  },

  _updateExerciseOptionValue(exerciseOptionId, value, displayValueAppender, isEndEditing) {
    let updatedExerciseOptions = this.state.selectedExercises.map(option => {
      if (option.exerciseOptionId === exerciseOptionId) {
        let updatedDisplayValue;
        if (!isEndEditing) { // is still changing the value
          updatedDisplayValue = value;
        } else if (value && value.length > 0) { // is done changing the value, displayValueAppender should have space prefixed if needed.
          updatedDisplayValue = `${value}${displayValueAppender}`;
        } else { // there is no value to display (value is also null or empty)
          updatedDisplayValue = null;
        }

        return {
          exerciseOptionId,
          alternativeIsSelected: option.alternativeIsSelected,
          altExerciseOptionId: option.altExerciseOptionId,
          displayValue: updatedDisplayValue,
          value
        };
      } else {
        return option;
      }
    });

    this.setState({...this.state, selectedExercises: updatedExerciseOptions});
  },

  _getInputComponent(exerciseOption) {
    if (exerciseOption.inputType === 'time') {
      return (
          <Button
              text={this._getTimedButtonText(exerciseOption.id)}
              raised={true}
              overrides={{
                textColor: Colors.defaultButtonColor,
                backgroundColor: Colors.spacMediumGray,
                rippleColor: Colors.spacLightGray
              }}
              onPress={() => {
                if (exerciseOption.inputType === 'time' && this.picker) {
                  this.picker.toggle();
                  this.setState({...this.state, timedExerciseOptionIdBeingEdited: exerciseOption.id});
                }
              }}
          />
      );
    } else if (exerciseOption.inputType === 'NA') {
      return null;
    } else { // numeric
      let resultsDisplayFieldName;
      let resultsDisplayFieldAppender; // should be applied to the value of the field when entered/present (and not being edited)
      if (exerciseOption.type.toUpperCase() === 'HEAVY') {
        resultsDisplayFieldName = ' Weight';
        resultsDisplayFieldAppender = 'lbs';
      } else {
        resultsDisplayFieldName = 'Repetitions';
        resultsDisplayFieldAppender = ' Reps';
      }

      let resultsPlaceholderText = `Enter ${resultsDisplayFieldName}`;
      return (
          <View style={styles.textInputParent}>
            <TextInput
                style={[styles.textInput]}
                keyboardType='numeric'
                // different displayValue when done editing to display something like (ie '50 Reps' or '200 lbs')
                onEndEditing={() => { // done dditing, add the appender to use as the displayValue
                  let value = this._getExerciseOption(exerciseOption.id).value;
                  this._updateExerciseOptionValue(exerciseOption.id, value, resultsDisplayFieldAppender, true);
                }}
                onFocus={() => { // reset the text box to use just the value (and not the displayValue)
                  let value = this._getExerciseOption(exerciseOption.id).value
                  this._updateExerciseOptionValue(exerciseOption.id, value, value, false);
                }}
                onChangeText={(text) => this._updateExerciseOptionValue(exerciseOption.id, text, '', false) }
                placeholder={resultsPlaceholderText}
                placeholderTextColor={Colors.spacGold}
                value={this._getExerciseOptionDisplayValue(exerciseOption.id)}/>
          </View>
      );
    }
  },

  _getWorkoutFromProps() {
    return this.props.workouts && this.props.workouts.length > 0 ? this.props.workouts[0] : null;
  },

  render() {
    this._displayLoadingIndicatorWhenLoading();
    this._closeViewIfWorkoutSuccessfullySaved();

    let workout = this._getWorkoutFromProps();

    let duration = WorkoutUtils.getDuration(workout);
    let workoutDescription = WorkoutUtils.getExerciseInstructions(workout);

    // create views for the selected options
    let exerciseOptionsCards = WorkoutUtils.getExerciseOptions(workout).map(exerciseOption => {
      let optionId = exerciseOption.id;

      // create alternative exercise option view
      let alternativeOptionView = this._createAlternativeOptionCard(exerciseOption, optionId);

      // get the optional description for display if found
      let exerciseOptionDescriptionText = this._getExerciseOptionDescriptionText(exerciseOption, optionId);

      // get the amount (targetAmount or duration) of the exercise option.
      let amount = this._getExerciseOptionAmount(exerciseOption);

      // get the input type for the display type of the exercise option
      let inputComponent = this._getInputComponent(exerciseOption);

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
                        // the user selected the primary option
                        isSelected={!this._exerciseOptionIsSelected(exerciseOption.id)}
                        onPress={() => this._updateSelectedExerciseOption(exerciseOption.id, false)}
                    />
                  </View>
                </View>
                <View style={[{flexDirection: 'column'}]}>
                  <Text style={styles.workoutTitle} key={'name_' + optionId}>{exerciseOption.name}</Text>
                  <Text style={styles.text} key={'amt_' + optionId}>{exerciseOption.type} - {amount}</Text>
                  {exerciseOptionDescriptionText}
                </View>
              </View>
              {alternativeOptionView}

              {inputComponent}
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

          <View style={{marginTop: 4, marginBottom: 4}}>
            <Button
                text='Complete Workout'
                raised={true}
                overrides={{
                  textColor: Colors.defaultButtonColor,
                  backgroundColor: Colors.spacLightGray,
                  rippleColor: Colors.spacMediumGray
                }}
                onPress={this._submitCompletedWorkout}
            />
          </View>

          {/* // picker for timed based results (displays minutes and seconds)*/}
          <Picker
              ref={picker => {
                this.picker = picker;
                return;
              }}
              style={{height: 280}}
              pickerElevation={100}
              pickerTitle={'Completed In'}
              pickerCancelBtnText={'Close'}
              pickerBtnText={'Save'}
              showMask={true}
              pickerToolBarStyle={{backgroundColor: Colors.spacMediumGray, height: 35}}
              pickerTitleStyle={styles.altTitle}
              pickerData={[this._getMinutesArray(), this._getSecondsArray()]} //picker`s value List
              selectedValue={[`0 ${MINUTES_TEXT_VALUE}`, `0 ${SECONDS_TEXT_VALUE}`]} //default to be selected value
              onPickerDone={(value) => {
                let parsedPickerValue = this._parseValueFromTimedBasedExerciseResult(value);
                this._updateExerciseOptionValue(this.state.timedExerciseOptionIdBeingEdited, parsedPickerValue, '', true);
              }}
          />
          <BusyIndicator />
        </View>
    );
  },

  _submitCompletedWorkout() {
    let incompletedExerciseIds = this.state.selectedExercises
        .filter(option => option.value === null)
        .map(option => option.exerciseOptionId);
    if (incompletedExerciseIds.length > 0) {
      this._incompletedWorkoutAlert(incompletedExerciseIds);
    } else {
      let completedWorkoutRequestBody = this.state.selectedExercises.map(option => {
        let selectedOptionId = option.alternativeIsSelected ? option.altExerciseOptionId : option.exerciseOptionId;
        return {
          exerciseOptionId: selectedOptionId,
          result: option.value
        };
      });

      this._saveCompletedWorkout(completedWorkoutRequestBody);
    }
  },

  _incompletedWorkoutAlert(incompletedExerciseIds) {
    let workout = this._getWorkoutFromProps();
    let incompleteExerciseNames = WorkoutUtils.getExerciseOptions(workout)
        .filter(option => incompletedExerciseIds.includes(option.id))
        .map(option => option.name)
        .join(', ');
    Alert.alert(
        'Cannot Submit Incompleted Workout',
        `Please provide your results for the following exercises: ${incompleteExerciseNames}`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}]
    );
  },

  _parseValueFromTimedBasedExerciseResult(value) {
    let minutes = value[0];
    let seconds = value[1];

    if (!minutes.includes(MINUTE_TEXT_VALUE) || !minutes.includes(MINUTES_TEXT_VALUE)) {
      minutes = minutes === '1' ? `${minutes} ${MINUTE_TEXT_VALUE}` : `${minutes} ${MINUTES_TEXT_VALUE}`;
    }

    if (!seconds.includes(SECOND_TEXT_VALUE) || !seconds.includes(SECONDS_TEXT_VALUE)) {
      seconds = seconds === '1' ? `${seconds} ${SECOND_TEXT_VALUE}` : `${seconds} ${SECONDS_TEXT_VALUE}`;
    }

    return `${minutes} ${seconds}`;
  },

  _getTimedButtonText(exerciseOptionId) {
    let foundOption = this._getExerciseOption(exerciseOptionId);
    return foundOption && foundOption.displayValue ? foundOption.displayValue : 'Enter Timed Results';
  },

  _getMinutesArray() {
    return [...Array(31).keys()].map(i => {
      if (i % 10 === 0) {
        return `${i} ${MINUTES_TEXT_VALUE}`;
      } else {
        return `${i}`;
      }
    });
  },

  _getSecondsArray() {
    return [...Array(60).keys()].map(i => {
      if (i % 10 === 0) {
        return `${i} ${SECONDS_TEXT_VALUE}`;
      } else {
        return `${i}`;
      }
    });
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
    height: 35,
    width: width * EXERCISE_OPTION_INPUT_WIDTH,
    textAlign: 'center',
    backgroundColor: Colors.spacLightGray,
    color: Colors.spacGold,
    fontFamily: Colors.textStyle
  },
  textInputParent: {
    height: 35,
    width: width * EXERCISE_OPTION_INPUT_WIDTH,
    marginTop: 10,
    justifyContent: 'center',
    borderBottomColor: Colors.spacGold,
    borderBottomWidth: 1
  },
  scrollView: {
    flex: 1
  }
});

export default WorkoutDetailView;
