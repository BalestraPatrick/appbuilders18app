import React from 'react';
import { StyleSheet, Text, View, Button, SectionList, Image, TouchableOpacity, Linking } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StackNavigator } from 'react-navigation';
import { AboutLibraries } from 'react-native-about-libraries';

export default class AcknowledgementsScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Acknowledgements',
      tabBarLabel: 'Information',
      showIcon: true,
      headerTintColor: '#e91e63',
      headerTitleStyle: { color: 'black' },
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../images/info.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      )
    }
	};
	

	getlibraries()  {
		return [{
				name: 'ReactJS',
				description: `React is a JavaScript library for building user interfaces`,
				link: 'https://github.com/facebook/react'
			},
			{
				name: 'React Native',
				description: 'Facebook React Native',
				link: 'https://github.com/facebook/react-native'
			},
			{
				name: 'React Native About Libraries',
				description: 'Offer information about install packages',
				link: 'https://github.com/prscX/react-native-about-libraries'
			},
			{
				name: 'React Native ActionSheet',
				description: 'An elagant ActionSheet component for React Native.',
				link: 'https://github.com/beefe/react-native-actionsheet'
			},
			{
				name: 'React Native Device Info',
				description: 'Device Information for React Native iOS and Android',
				link: 'https://github.com/rebeccahughes/react-native-device-info'
			},
			{
				name: 'React Native Firebase',
				description: 'A well tested feature rich Firebase implementation for React Native',
				link: 'https://github.com/invertase/react-native-firebase'
			},
			{
				name: 'React Native Mail',
				description: 'A wrapper on top of MFMailComposeViewController from iOS and Mail Intent on android',
				link: 'react-native-mail'
			},
			{
				name: 'React Native Maps',
				description: 'React Native Mapview component for iOS + Android',
				link: 'https://github.com/react-community/react-native-maps'
			},
			{
				name: 'React Native Open Maps',
				description: 'A simple lib to open up the corresponding map (Google or Apple Maps)',
				link: 'https://github.com/brh55/react-native-open-maps'
			},
			{
				name: 'React Native Safari View',
				description: 'A React Native wrapper for Safari View Controller.',
				link: 'https://github.com/naoufal/react-native-safari-view'
			},
			{
				name: 'React Native Segmented Control Tab',
				description: `A react native component with the same concept of react natives SegmentedControlIOS`,
				link: 'https://github.com/kirankalyan5/react-native-segmented-control-tab'
			},
			{
				name: 'React Native Navigation',
				description: 'Routing and navigation for your React Native apps',
				link: 'https://github.com/react-navigation/react-navigation'
			}
		]
	}

  render() {
    return (
	    <View style={styles.container}>
		    <AboutLibraries libraries={this.getlibraries()} />
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 0,
		backgroundColor: 'transparent'
	},
	organizerTextContainer: {
		flex: 1,
		flexDirection: 'column',
		borderRadius: 10
	},
	organizerImage: {
		margin: 10,
		width: 75,
		height: 75,
		borderRadius: 10
	},
	organizerName: {
		marginTop: 10,
		fontSize: 18,
		fontWeight: 'bold',
		borderRadius: 10
	},
	organizerTwitter: {
		fontSize: 16,
	},
	organizerBio: {
		paddingTop: 5,
		marginBottom: 5,
		fontSize: 16,
	},
	organizerContainer: {
		flex: 1,
		flexDirection: 'row',
		margin: 10,
		backgroundColor: 'white',
		borderRadius: 10,
		shadowOpacity: 0.1,
		shadowRadius: 10,
		shadowColor: 'black',
		shadowOffset: { height: 1, width: 0 },
	}
})
