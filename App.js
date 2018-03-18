import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Platform } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';

import ScheduleScreen from './Schedule/ScheduleScreen';
import TalkScreen from './Schedule/TalkScreen';
import SpeakersScreen from './Speakers/SpeakersScreen';
import SpeakerDetailsScreen from './Speakers/SpeakerDetailsScreen';
import SponsorsScreen from './Sponsors/SponsorsScreen';
import NewsScreen from './News/NewsScreen';
import InformationScreen from './Information/InformationScreen';
import VenueLocationScreen from './Information/VenueLocationScreen';
import OrganizersScreen from './Information/OrganizersScreen';
import AcknowledgementsScreen from './Information/AcknowledgementsScreen';

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
  News: {
    screen: StackNavigator({
      News: { screen: NewsScreen },
    })
  },
  Information: {
    screen: StackNavigator({
      Information: { screen: InformationScreen },
      VenueLocation: { screen: VenueLocationScreen },
      Organizers: { screen: OrganizersScreen },
      Acknowledgements: { screen: AcknowledgementsScreen }
    })
  }
},
{
  tabBarPosition: 'bottom',
  animationEnabled: true,
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: '#e91e63',
    ...Platform.select({
      android: {
        inactiveTintColor: 'grey',
        pressColor: '#e91e63',
        showIcon: true,
        showLabel: true,
        upperCaseLabel: false,
        iconStyle: {
          width: 35,
          height: 30
        },
        labelStyle: {
          fontSize: 11,
        },
        indicatorStyle: {
          backgroundColor: 'white'
        },
        style: {
          backgroundColor: 'white',
        },
      },
      ios: {}
    })
  }
});

export default class App extends React.Component {
  render = () => <Tabs />
}
