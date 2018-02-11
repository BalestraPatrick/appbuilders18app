import React from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView, WebView } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StackNavigator } from 'react-navigation';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';

export default class VenueInformationScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Venue Location',
      tabBarLabel: 'Information',
      showIcon: true,
      headerTintColor: '#e91e63',
      headerTitleStyle: { color: 'black' },
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../images/info.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
      headerRight: (
        <Button title="Open In" color="#e91e63" onPress={() => this.showMapsOptions}></Button>
      ),
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      coordinate: new AnimatedRegion({
        latitude: 46.005085,
        longitude: 8.956363,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      }),
    }
  }

  showMapsOptions() {
    // TODO: Show action sheet to open iOS Maps or Google Maps via URL scheme
  }

  render() {
    const item = this.props.navigation.state.params;
    return (
      <ScrollView style={styles.viewContainer}>
        <View style={styles.informationContainer}>
          <View style={styles.speakerContainer}>
            <Image style={styles.speakerImage} source={require('../images/venue.jpg')} />
            <Text style={styles.speakerName}>Palazzo dei Congressi Lugano</Text>
            <Text style={styles.speakerInformation}>Piazza Indipendenza 4</Text>
            <Text style={styles.speakerInformation}>6900 Lugano, Switzerland</Text>
            <MapView
              style={styles.map}
              initialRegion={{
              latitude: 46.005085,
              longitude: 8.956363,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
              }}>
              <MapView.Marker.Animated ref={marker => { this.marker = marker }} coordinate={this.state.coordinate}/>
            </MapView>
        	</View>
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
    resizeMode: 'contain',
    flex: 1,
    width: null,
    height: 230,
  },
  map: {
    flex: 1,
    width: null,
    height: 230,
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
    flexDirection: 'column',
	margin: 10,
  },
})
