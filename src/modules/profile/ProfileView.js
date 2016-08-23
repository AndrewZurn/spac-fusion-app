import React, {PropTypes} from 'react';
import {
  Dimensions,
  Text,
  TextInput,
  View,
  ScrollView,
  StyleSheet
} from 'react-native';
import {Card} from 'react-native-material-design';
import * as NavigationState from '../../modules/navigation/NavigationState';
import Colors from '../../utils/colors';
import * as ProfileState from './ProfileState';
import * as WorkoutUtils from '../../utils/workoutUtils';
import moment from 'moment';

const width = Dimensions.get('window').width;
const TestUserId = '123454321';
var page = 0;

/**
 * Sample view to demonstrate navigation patterns.
 * @TODO remove this module in a live application.
 */
const ProfileView = React.createClass({
  propTypes: {
    fusionUser: PropTypes.object,
    auth0User: PropTypes.object.isRequired,
    completedWorkouts: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getAuth0UserId() {
    if (this.props.auth0User && this.props.auth0User.userId) { return this.props.auth0User.userId.split('|')[1]; }
    else if (__DEV__) { return TestUserId; }
    else { return ''; }
  },
  getFusionUser() {
    let auth0UserId = this.getAuth0UserId();
    this.props.dispatch(ProfileState.getFusionUserByAuth0Id(auth0UserId));
  },
  getFusionUserCompletedWorkouts() {
    if (this.props.fusionUser) {
      this.props.dispatch(ProfileState.getFusionUserCompletedWorkouts(this.props.fusionUser.id, page));
      page++;
    }
  },
  getFusionUserName() {
    if (this.props.fusionUser && this.props.fusionUser.firstName && this.props.fusionUser.lastName) {
      return this.props.fusionUser.firstName + ' ' + this.props.fusionUser.lastName;
    } else {
      return '';
    }
  },
  getFusionUserEmail() {
    if (this.props.fusionUser && this.props.fusionUser.email) { return this.props.fusionUser.email; }
    else { return ''; }
  },
  getFusionUserHeight() {
    if (this.props.fusionUser && this.props.fusionUser.height) { return this.props.fusionUser.height; }
    else { return null; }
  },
  getFusionUserWeight() {
    if (this.props.fusionUser && this.props.fusionUser.weight) { return this.props.fusionUser.weight; }
    else { return null; }
  },
  getFusionUserLevel() {
    if (this.props.fusionUser && this.props.fusionUser.programLevel) { return this.props.fusionUser.programLevel; }
    else { return ''; }
  },

  render() {
    let userName = this.getFusionUserName();
    let userEmail = this.getFusionUserEmail();
    let userHeight = this.getFusionUserHeight();
    let userWeight = this.getFusionUserWeight();
    let userFusionLevel = this.getFusionUserLevel();

    let completedWorkoutsCards;
    if (this.props.completedWorkouts && this.props.completedWorkouts.length > 0) {
      completedWorkoutsCards = this.props.completedWorkouts.map(workout => {
        let day = moment(workout.completedDate).format('dddd');
        let date = moment(workout.completedDate).format('MMM Do');
        return (
            <Card style={styles.card}>
              <Card.Body>
                <Text style={styles.text}>{day} - {date}</Text>
                <Text style={styles.text}>{workout.exerciseName}</Text>
              </Card.Body>
            </Card>
        );
      });
    }

    return (
        <View style={styles.container} onLayout={this.getFusionUser}>
          <Card style={styles.card}>
            <Card.Body>
              <Text style={styles.title}>{userName}</Text>
              <Text style={styles.text}>{userEmail}</Text>
              <Text style={[styles.text, styles.moreMarginBottom]}>
                Fusion Level: {userFusionLevel}
              </Text>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.text}>Height</Text>
                  <TextInput
                      style={styles.textEditHalfWidth}
                      onChangeText={(text) => this.setState({text})}
                      placeholder='Enter height'
                      value={userHeight}/>
                </View>

                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.text}>Weight</Text>
                  <TextInput
                      style={[styles.textEditHalfWidth, styles.moreMarginBottom]}
                      onChangeText={(text) => this.setState({text})}
                      placeholder='Enter weight'
                      value={userWeight}/>
                </View>
              </View>

            </Card.Body>
          </Card>

          <Card style={styles.card}>
            <Card.Body>
              <Text style={styles.title}>Completed Workouts</Text>
              </Card.Body>
            </Card>

          <ScrollView ref='scrollView'
                          keyboardDismissMode='interactive'
                          style={styles.scrollView}>
                {completedWorkoutsCards}
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
  title: {
    justifyContent: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.spacGold,
    paddingBottom: 2
  },
  text: {
    fontSize: 16,
    color: Colors.spacCream
  },
  textEdit: {
    height: 35,
    width: width * 0.8,
    marginBottom: 5,
    borderColor: Colors.spacGray,
    backgroundColor: 'white',
    borderWidth: 1
  },
  textEditHalfWidth: {
    height: 35,
    width: width * 0.40,
    marginBottom: 5,
    borderColor: Colors.spacGray,
    backgroundColor: 'white',
    borderWidth: 1
  },
  moreMarginBottom: {
    marginBottom: 10
  },
  card: {
    backgroundColor: Colors.spacLightGray
  },
  scrollView: {
    flex: 1
  }
});

export default ProfileView;
