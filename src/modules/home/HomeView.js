import React, {PropTypes} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {Card} from 'react-native-material-design';
import Colors from '../../utils/colors';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const HomeView = React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired
  },

  render() {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Body>
            <Image resizeMode='stretch'
                   style={styles.stretch}
                   source={require('../../img/fusion-by-spac-icon.jpeg')}/>
            <Text style={styles.text}>
              {'\n'}FUSION: Metabolic conditioning fusing together the best of function, full body strength,
              and cardio training into one effective program.{'\n'}
            </Text>
            <Text style={styles.text}>
              Make the most of every second you spend in the gym. Fusion is hard-core results backed by
              hard-core science. Say goodbye to boredom with constant variation, strategic movements,
              and intensity to create a stronger, leaner, more flexible, healthier YOU.{'\n'}
            </Text>
            <Text style={styles.text}>
              Fusion is strength. Fat loss. Muscle building. Mobility. Longevity.
              If the question is: "How can I be better today?" Fusion is the answer.{'\n'}
            </Text>
            <Text style={styles.text}>
              Monday – Friday: 6:00 am, noon, 5:30 pm{'\n'}
              Saturday: 8 am and 9 am
            </Text>
          </Card.Body>
        </Card>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
    paddingTop: 70,
    alignItems: 'center',
    backgroundColor: Colors.spacMediumGray
  },
  card: {
    height: height * 0.8,
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
  },
  stretch: {
    width: width * .87,
    alignItems: 'center',
    height: 75
  }
});

export default HomeView;
