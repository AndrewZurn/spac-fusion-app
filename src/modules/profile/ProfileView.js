import React, {PropTypes} from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';

import * as NavigationState from '../../modules/navigation/NavigationState';
//import * as ProfileState from './ProfileState';

/**
 * Sample view to demonstrate navigation patterns.
 * @TODO remove this module in a live application.
 */
const ProfileView = React.createClass({
  propTypes: {
    index: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired
  },

  getInitialState() {
    return {

    };
  },

  onNextPress() {
    const index = this.props.index;
    this.props.dispatch(NavigationState.pushRoute({key: `Workout_${index + 1}`}));
  },

  render() {
    const text = 'Profile View';
    return (
      <View style={styles.container}>
        <Text onPress={this.onNextPress}>
          {text}
        </Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
});

export default ProfileView;
