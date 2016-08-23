import React, {PropTypes} from 'react';
import {
    Dimensions,
    ListView,
    Text,
    TextInput,
    TouchableHighlight,
    View,
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
    console.log('doing something');
    if (__DEV__) {
      return TestUserId;
    }
    else if (this.props.auth0User && this.props.auth0User.get('userId')) {
      return this.props.auth0User.get('userId').split('|')[1];
    }
    else {
      return '';
    }
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
    if (this.props.fusionUser && this.props.fusionUser.email) {
      return this.props.fusionUser.email;
    }
    else {
      return '';
    }
  },
  getFusionUserHeight() {
    if (this.props.fusionUser && this.props.fusionUser.height) {
      return this.props.fusionUser.height;
    }
    else {
      return null;
    }
  },
  getFusionUserWeight() {
    if (this.props.fusionUser && this.props.fusionUser.weight) {
      return this.props.fusionUser.weight;
    }
    else {
      return null;
    }
  },
  getFusionUserLevel() {
    if (this.props.fusionUser && this.props.fusionUser.programLevel) {
      return this.props.fusionUser.programLevel;
    }
    else {
      return '';
    }
  },

  render() {
    let userName = this.getFusionUserName();
    let userEmail = this.getFusionUserEmail();
    let userHeight = this.getFusionUserHeight();
    let userWeight = this.getFusionUserWeight();
    let userFusionLevel = this.getFusionUserLevel();

    let completedWorkoutsDataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    if (this.props.completedWorkouts && this.props.completedWorkouts.length > 0) {
      completedWorkoutsDataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
          .cloneWithRows(this.props.completedWorkouts);
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
                <View style={[styles.textInputParent, {flexDirection: 'column'}]}>
                  <Text style={styles.text}>Height</Text>
                  <TextInput
                      style={styles.textEditHalfWidth}
                      onChangeText={(text) => this.setState({text})}
                      placeholder='Enter height'
                      placeholderTextColor={Colors.spacGold}
                      value={userHeight}/>
                </View>

                <View style={[styles.textInputParent, {flexDirection: 'column'}]}>
                  <Text style={styles.text}>Weight</Text>
                  <TextInput
                      style={[styles.textEditHalfWidth]}
                      onChangeText={(text) => this.setState({text})}
                      placeholder='Enter weight'
                      placeholderTextColor={Colors.spacGold}
                      value={userWeight}/>
                </View>
              </View>

            </Card.Body>
          </Card>

          <Card style={styles.card}>
            <Card.Body>
              <Text style={styles.title}>Completed Workouts</Text>
              <ListView
                  dataSource={completedWorkoutsDataSource}
                  style={styles.listView}
                  renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                  renderRow={(workout) => {
                    let day = moment(workout.completedDate).format('dddd');
                    let date = moment(workout.completedDate).format('MMM Do');
                    return (
                        <TouchableHighlight onPress={() => console.log('im doing it here!!!')}
                                            underlayColor='#dddddd'>
                          <View style={{paddingTop: 7, paddingBottom: 7}}>
                            <Text style={styles.text} key={workout.id + '_day'}>{day} - {date}</Text>
                            <Text style={styles.text} key={workout.id + '_name'}>{workout.exerciseName}</Text>
                          </View>
                        </TouchableHighlight>
                    );
                  }}
              />
            </Card.Body>
          </Card>

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
    fontSize: Colors.titleSize,
    fontWeight: 'bold',
    color: Colors.spacGold,
    paddingBottom: 2,
    fontFamily: Colors.textStyle
  },
  text: {
    fontSize: Colors.textSize,
    color: Colors.spacCream,
    fontFamily: Colors.textStyle
  },
  textEditHalfWidth: {
    height: 35,
    width: width * 0.40,
    backgroundColor: Colors.spacLightGray,
    color: Colors.spacGold,
    fontFamily: Colors.textStyle
  },
  // workaround as textinput bottom border doesn't seem to be working currently.
  // https://github.com/facebook/react-native/issues/7029
  textInputParent: {
    borderBottomColor: Colors.spacGold,
    borderBottomWidth: 1
  },
  moreMarginBottom: {
    marginBottom: 10
  },
  card: {
    backgroundColor: Colors.spacLightGray
  },
  separator: {
    height: 1,
    backgroundColor: Colors.spacGold
  },
  listView: {
    backgroundColor: Colors.spacLightGray
  },
  cellContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.spacLightGray
  }
});

export default ProfileView;
