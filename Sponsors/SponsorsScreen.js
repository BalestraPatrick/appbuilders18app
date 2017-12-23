// @flow
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, ScrollView } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';

class Sponsors extends React.Component {

  render() {
    const sponsors = this.props.sponsors.map((sponsor) => {
      return (
        <View key={sponsor.id}>
          <Image source={sponsor.image}/>
          <Text>{sponsor.name}</Text>
        </View>
      )
    })
    return (
      <View style={styles.sponsorContainer}>
        <Text style={styles.sponsorTitle}>{this.props.type}</Text>
        <View style={styles.diamondSponsorsContainer}>
          {sponsors}
        </View>
      </View>
    )
  }
}

export default class ScheduleScreen extends React.Component {
  static navigationOptions = {
    title: 'Sponsors',
    tabBarLabel: 'Sponsors',
    showIcon: true,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../images/sponsors.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    const { navigate } = this.props.navigation;
    const diamond = [
      {id: 1, name: "SBB", image: require("../images/speaker.png")},
      {id: 2, name: "Junior", image: require("../images/speaker.png")},
    ]
    return (
      <ScrollView>
        <Sponsors type={"💎 Diamond"} sponsors={diamond}/>
        <Sponsors type={"🥈 Platinum"} sponsors={diamond}/>
        <Sponsors type={"🏅 Gold"} sponsors={diamond}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  sponsorContainer: {
    backgroundColor: 'transparent',
    margin: 10,
  },
  sponsorTitle: {
    borderRadius: 10,
    margin: 10,
    fontSize: 20
  },
  diamondSponsorsContainer: {
    flex: 1,
    flexGrow: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10
  }
})
