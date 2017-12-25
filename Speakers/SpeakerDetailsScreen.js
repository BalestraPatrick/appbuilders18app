import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, ScrollView, WebView } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StackNavigator } from 'react-navigation';

export default class SpeakerDetailsScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: `${navigation.state.params.fields.firstName} ${navigation.state.params.fields.lastName}`,
      tabBarLabel: 'Speakers',
      showIcon: true,
      headerTintColor: '#e91e63',
      headerTitleStyle: { color: 'black' },
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../images/speaker.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.viewContainer}>
        <Text>Best Talk</Text>
        <WebView style={styles.webView} source={twitter}/>
      </ScrollView>
    );
  }
}

const twitter = require('../twitter.html');

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: 'transparent',
  },
  webView: {
    height: 400
  }
})
