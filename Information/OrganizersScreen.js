import React from 'react';
import { StyleSheet, Text, View, Button, SectionList, Image, TouchableOpacity, Linking } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StackNavigator } from 'react-navigation';
import { handleExternalUrl } from '../components/Browser';

export default class VenueInformationScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Organizers',
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

  constructor(props) {
    super(props);
    this.state = {
      sections: [
		  {
			title: "",
			data: [
				{
					name: "Junior Bontognali",
					twitter: "BontoJR",
					bio: "Co-author of @RxSwiftLang: Reactive Programming with Swift",
					image: require('../images/organizers/junior.jpg')
				},
				{
					name: "Patrick Balestra",
					twitter: "BalestraPatrick",
					bio: "Software Engineer @Scandit and Informatics student @USI_university",
					image: require('../images/organizers/patrick.jpg')
				},
				{
					name: "Ivan Morgilo",
					twitter: "hamen",
					bio: "Android at @asanarebel, author of Grokking ReactiveX",
					image: require('../images/organizers/ivan.jpg')
				},
				{
					name: "Luca Scuderi",
					twitter: "lucascuderi",
					bio: "Student @heg_fr and iOS/Web developer @SIM_GmbH & partners ",
					image: require('../images/organizers/luca.jpg')
				}
			]
		  }
	  ]
    }
  }

  openTwitter(item) {
		const url = `https://twitter.com/${item.twitter}`;
		handleExternalUrl(url);
  }

  renderSpeaker(item) {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity onPress={() => this.openTwitter(item)}>
        <View style={styles.organizerContainer}>
            <Image style={styles.organizerImage} source={item.image}/>
            <View style={styles.organizerTextContainer}>
              <Text style={styles.organizerName}>{item.name}</Text>
			  <Text style={styles.organizerTwitter}>@{item.twitter}</Text>
              <Text style={styles.organizerBio}>{item.bio}</Text>
            </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
			<View style={styles.container}>
        <SectionList
          sections={this.state.sections}
          renderItem={({item}) => this.renderSpeaker(item)}
          keyExtractor={(item, index) => index}
        />
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
