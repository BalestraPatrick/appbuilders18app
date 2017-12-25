import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { Timeline } from 'react-twitter-widgets'

export default class SpeakerDetailsScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: `${navigation.state.params.fields.firstName} ${navigation.state.params.fields.lastName}`,
      tabBarLabel: 'Speakers',
      showIcon: true,
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../images/speaker.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
    }
  };

  render() {
    console.log(`item: ${JSON.stringify(this.props.navigation.state.params.fields.firstName, null, 2)}`);
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Best Talk</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center'
  }
})
