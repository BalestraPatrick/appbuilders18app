import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, ScrollView, TouchableOpacity } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import SafariView from 'react-native-safari-view';

class Sponsors extends React.Component {

  render() {
    const isDiamond = this.props.type == "💎 Diamond"
    const sponsors = this.props.sponsors.map((sponsor) => {
      return (
        <View key={sponsor.id} style={isDiamond ? styles.diamondSponsorContainer : styles.normalSponsorContainer}>
          <TouchableOpacity onPress={this._onPress}>
            <Image source={sponsor.image} />
          </TouchableOpacity>
          <Text>{sponsor.name}</Text>
        </View>
      )
    })
    return (
      <View style={styles.sponsorsContainer}>
        <Text style={styles.sponsorTitle}>{this.props.type}</Text>
        <View style={isDiamond ? styles.diamondSponsorsContainer : styles.normalSponsorsContainer}>
          {sponsors}
        </View>
      </View>
    )
  }

  _onPress() {
    SafariView.isAvailable()
    .then(SafariView.show({
      url: 'https://www.google.com'
    }))
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
      {id: 1, name: "Patrick", image: require("../images/speaker.png")},
      {id: 2, name: "Junior", image: require("../images/speaker.png")},
      {id: 3, name: "Luca", image: require("../images/speaker.png")},
    ]
    return (
      <ScrollView>
        <Sponsors type={"💎 Diamond"} sponsors={diamond} />
        <Sponsors type={"🥈 Platinum"} sponsors={diamond} />
        <Sponsors type={"🏅 Gold"} sponsors={diamond} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  sponsorsContainer: {
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
  },
  normalSponsorsContainer: {
    flex: 1,
    flexGrow: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    flexWrap: 'wrap',
  },
  diamondSponsorContainer: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalSponsorContainer: {
    flex: 1,
    padding: 10,
    minWidth: '45%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
