import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Schedule from './Schedule/Schedule';
import Speakers from './Speakers/Speakers';

const Tabs = TabNavigator({
  Schedule: {
    screen: Schedule,
  },
  Speakers: {
    screen: Speakers,
  },
},
{
  tabBarPosition: 'bottom',
  animationEnabled: true,
  swipeEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});

export default class App extends React.Component {
  render() {
    return (
      // <SafeAreaView style={styles.safeArea}>
        <Tabs/>
      // </SafeAreaView>
    );
  }
}
