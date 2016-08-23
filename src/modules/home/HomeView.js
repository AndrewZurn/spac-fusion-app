import React, {PropTypes} from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    ScrollView,
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
            </Card.Body>
          </Card>
          <ScrollView ref='scrollView'
                      keyboardDismissMode='interactive'
                      style={styles.scrollView}>
            <Card style={styles.card}>
              <Card.Body>
                <Text style={styles.text} key={2}>
                  Make the most of every second you spend in the gym. Fusion is hard-core results backed by
                  hard-core science. Say goodbye to boredom with constant variation, strategic movements,
                  and intensity to create a stronger, leaner, more flexible, healthier YOU.{'\n'}
                </Text>
                <Text style={styles.text} key={3}>
                  Fusion is strength. Fat loss. Muscle building. Mobility. Longevity.
                  If the question is: "How can I be better today?" Fusion is the answer.{'\n'}
                </Text>
                <Text style={styles.text} key={4}>
                  Monday – Friday: 6:00 am, noon, 5:30 pm{'\n'}
                  Saturday: 8 am and 9 am
                </Text>
              </Card.Body>
            </Card>
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
  card: {
    backgroundColor: Colors.spacLightGray
  },
  workoutTitle: {
    justifyContent: 'center',
    fontSize: Colors.titleSize,
    fontWeight: 'bold',
    color: Colors.spacGold,
    paddingBottom: 5,
    fontFamily: Colors.textStyle
  },
  text: {
    fontSize: Colors.textSize - 1,
    color: Colors.spacCream,
    fontFamily: Colors.textStyle
  },
  stretch: {
    width: width * .87,
    alignItems: 'center',
    height: 75
  },
  scrollView: {
    flex: 1
  }
});

export default HomeView;
