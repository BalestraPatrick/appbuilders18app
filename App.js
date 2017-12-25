import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import ScheduleScreen from './Schedule/ScheduleScreen';
import TalkScreen from './Schedule/TalkScreen';
import SpeakersScreen from './Speakers/SpeakersScreen';
import SpeakerDetailsScreen from './Speakers/SpeakerDetailsScreen';
import SponsorsScreen from './Sponsors/SponsorsScreen';
import InformationScreen from './Information/InformationScreen';

const Tabs = TabNavigator({
  Schedule: {
    screen: StackNavigator({
      Schedule: { screen: ScheduleScreen },
      Talk: { screen: TalkScreen },
    }),
  },
  Speakers: {
    screen: StackNavigator({
      Speakers: { screen: SpeakersScreen },
      SpeakerDetails: { screen: SpeakerDetailsScreen },
    }),
  },
  Sponsors: {
    screen: StackNavigator({
      Sponsors: { screen: SponsorsScreen },
    })
  },
  Information: {
    screen: StackNavigator({
      Information: { screen: InformationScreen },
    })
  }
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
        <Tabs/>
    );
  }
}
