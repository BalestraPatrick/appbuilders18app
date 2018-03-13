import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { handleExternalUrl } from '../components/Browser';

class Sponsors extends React.Component {

  render() {
    const isDiamond = this.props.type == "💎 Diamond"
    const sponsors = this.props.sponsors.map((sponsor) => {
      return (
        <View key={sponsor.id} style={isDiamond ? styles.diamondSponsorContainer : styles.normalSponsorContainer}>
          <TouchableOpacity onPress={() => {this._onPress(sponsor)}}>
            <Image style={styles.image} source={sponsor.image} />
          </TouchableOpacity>
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

  openLink(url) {
    handleExternalUrl(url);
  }

  _onPress(sponsor) {
    this.openLink(sponsor.url);
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
      
    ]
    const platinum = [
      { id: 1, name: "Cryms", image: require("../images/sponsors/cryms.jpg"), url: "http://www.cryms.ch/" },
      { id: 2, name: "Dreipol", image: require("../images/sponsors/dreipol.jpg"), url: "http://www.dreipol.ch/" },
      { id: 3, name: "Ubique", image: require("../images/sponsors/ubique.jpg"), url: "https://www.ubique.ch" },
    ]
    const gold = [
      { id: 1, name: "Fondazione Agire", image: require("../images/sponsors/agire.jpg"), url: "http://www.agire.ch/" },
      { id: 2, name: "White Peaks", image: require("../images/sponsors/whitepeaks.jpg"), url: "http://www.whitepeaksmobile.ch" },
    ]
    return (
      <ScrollView>
        <Sponsors type={"💎 Diamond"} sponsors={diamond} />
        <Sponsors type={"🥈 Platinum"} sponsors={platinum} />
        <Sponsors type={"🏅 Gold"} sponsors={gold} />
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
  image: {
    width: Dimensions.get('window').width / 2.2,
    resizeMode: 'contain'
  },
  diamondSponsorsContainer: {
    flex: 1,
    flexGrow: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
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
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  }
})
