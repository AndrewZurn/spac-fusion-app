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
import moment from 'moment';
import Colors from '../../utils/colors';
import * as NavigationState from '../../modules/navigation/NavigationState';
import * as ProfileState from './ProfileState';
import * as AuthState from '../auth/AuthState';
import * as WorkoutUtils from '../../utils/workoutUtils';

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

const width = Dimensions.get('window').width;
var page = 0;

/**
 * Sample view to demonstrate navigation patterns.
 * @TODO remove this module in a live application.
 */
const ProfileView = React.createClass({
  propTypes: {
    fusionUser: PropTypes.object.isRequired,
    completedWorkouts: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  getInitialState() {
    return {
      updatedHeight: null,
      updatedWeight: null,
      updatedAge: null
    };
  },
  componentDidMount() {
    MessageBarManager.registerMessageBar(this.refs.alert);
  },
  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
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
    } else {
      return '';
    }
  },
  getFusionUserHeight() {
    if (this.state && this.state.updatedHeight !== null) {
      return this.state.updatedHeight.toString();
    } else if (this.props.fusionUser && this.props.fusionUser.height) {
      return this.props.fusionUser.height.toString();
    } else {
      return '';
    }
  },
  getFusionUserWeight() {
    if (this.state && this.state.updatedWeight !== null) {
      return this.state.updatedWeight.toString();
    } else if (this.props.fusionUser && this.props.fusionUser.weight) {
      return this.props.fusionUser.weight.toString();
    } else {
      return '';
    }
  },
  getFusionUserAge() {
    if (this.state && this.state.updatedAge !== null) {
      return this.state.updatedAge.toString();
    } else if (this.props.fusionUser && this.props.fusionUser.age) {
      return this.props.fusionUser.age.toString();
    } else {
      return '';
    }
  },
  getFusionUserLevel() {
    if (this.props.fusionUser && this.props.fusionUser.programLevel) {
      return this.props.fusionUser.programLevel;
    } else {
      return '';
    }
  },
  updateFusionUser(user) {
    this.props.dispatch(AuthState.updateUserRequest(user));
  },
  updatedProfileNotification() {
    MessageBarManager.showAlert({
      title: 'Profile has been updated',
      message: 'Your alert message goes here',
      viewTopOffset: -300
    });
  },

  render() {
    let userName = this.getFusionUserName();
    let userEmail = this.getFusionUserEmail();
    let userHeight = this.getFusionUserHeight();
    let userWeight = this.getFusionUserWeight();
    let userAge = this.getFusionUserAge();
    let userFusionLevel = this.getFusionUserLevel();

    let completedWorkoutsDataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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
                      style={styles.textEditThirdWidth}
                      keyboardType='numeric'
                      onEndEditing={() => {
                        if (this.state.updatedHeight !== null) {
                          this.props.fusionUser.height = parseFloat(this.state.updatedHeight);
                          this.setState({...this.state, updatedHeight: null});
                          this.updateFusionUser(this.props.fusionUser);
                          this.updatedProfileNotification();
                        }
                      }}
                      onChangeText={(text) => this.setState({...this.state, updatedHeight: text}) }
                      placeholder='Enter height'
                      placeholderTextColor={Colors.spacGold}
                      value={userHeight}/>
                </View>

                <View style={[styles.textInputParent, {flexDirection: 'column'}]}>
                  <Text style={styles.text}>Weight</Text>
                  <TextInput
                      style={[styles.textEditThirdWidth]}
                      keyboardType='numeric'
                      onEndEditing={() => {
                        if (this.state.updatedWeight !== null) {
                          this.props.fusionUser.weight = parseFloat(this.state.updatedWeight);
                          this.setState({...this.state, updatedWeight: null});
                          this.updateFusionUser(this.props.fusionUser);
                          this.updatedProfileNotification();
                        }
                      }}
                      onChangeText={(text) => this.setState({...this.state, updatedWeight: text}) }
                      placeholder='Enter weight'
                      placeholderTextColor={Colors.spacGold}
                      value={userWeight}/>
                </View>

                <View style={[styles.textInputParent, {flexDirection: 'column'}]}>
                  <Text style={styles.text}>Age</Text>
                  <TextInput
                      style={[styles.textEditThirdWidth]}
                      keyboardType='numeric'
                      onEndEditing={() => {
                        if (this.state.updatedAge !== null) {
                          this.props.fusionUser.age = parseInt(this.state.updatedAge);
                          this.setState({...this.state, updatedAge: null});
                          this.updateFusionUser(this.props.fusionUser);
                          this.updatedProfileNotification();
                        }
                      }}
                      onChangeText={(text) => this.setState({...this.state, updatedAge: text}) }
                      placeholder='Enter age'
                      placeholderTextColor={Colors.spacGold}
                      value={userAge}/>
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
                  renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator}/>}
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

          <MessageBarAlert ref='alert'/>
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
  textEditThirdWidth: {
    height: 35,
    width: width * 0.27,
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
