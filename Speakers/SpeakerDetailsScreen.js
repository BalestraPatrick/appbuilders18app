import React from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView, Linking } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StackNavigator } from 'react-navigation';

import Ionicons from 'react-native-vector-icons/Ionicons'

export default class SpeakerDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: `${params.firstName} ${params.lastName}`,
      tabBarLabel: 'Speakers',
      showIcon: true,
      headerTintColor: '#e91e63',
      headerTitleStyle: { color: 'black' },
      headerRight: params.button,
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../images/speaker.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
    }
  };

  componentWillMount = () => {
    const speaker = this.props.navigation.state.params;
    speaker.twitter &&
    this.props.navigation.setParams({ 
      button: <Ionicons 
        color="#e91e63" 
        name="logo-twitter" 
        size={30}
        style={styles.twitterIcon}
        onPress={() => 
          Linking.openURL(`https://twitter.com/${speaker.twitter}`)
        } 
      />
    });
  }

  render = () => {
    const item = this.props.navigation.state.params;
    return (
      <ScrollView style={styles.viewContainer}>
        <View style={styles.informationContainer}>
          <View style={styles.speakerContainer}>
            <Image style={styles.speakerImage} source={{uri: item.picture}} />
            <View style={styles.speakerTextContainer}>
              <Text style={styles.speakerName}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.speakerInformation}>{item.jobTitle} {item.company}</Text>
            </View>
          </View>
          <Text style={styles.speakerBiography}>{item.biography}</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: 'transparent',
  },
  informationContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
    margin: 10,
  },
  webView: {
    height: 400,
    shadowRadius: 10,
  },
  sectionHeader: {
    marginTop: 0,
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    backgroundColor: 'rgba(247,247,247,1.0)',
    height: 20,
    fontSize: 14,
    fontWeight: 'bold',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
  },
  speakerTextContainer: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 10
  },
  speakerImage: {
    margin: 10,
    width: 75,
    height: 75,
    borderRadius: 10
  },
  speakerName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 10
  },
  speakerInformation: {
    paddingTop: 5,
    fontSize: 18,
  },
  speakerBiography: {
    margin: 10
  },
  speakerContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
  twitterIcon: {
    paddingRight: 8
  }
})
