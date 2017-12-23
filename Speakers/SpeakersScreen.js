import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, AppRegistry, SectionList } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
const { createClient } = require('../Contentful/contentful.js');

export default class SpeakersScreen extends React.Component {
  static navigationOptions = {
    title: 'Speakers',
    tabBarLabel: 'Speakers',
    showIcon: true,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../images/speaker.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
		client.getEntries({content_type: '2PqfXUJwE8qSYKuM0U6w8M'}).then((response)=>{
			this.setState({dataSource: this.ds.cloneWithRows(response.items.map(function(product){
				return product.fields.productName
			}))})
		}).catch(function(error){
			console.log("ERRRORRRRR" + error)
		});
    return (
      <View style={styles.container}>
        <SectionList
          sections={[
            {title: 'D', data: ['Devin']},
            {title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie']},
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

const client = createClient({
  accessToken: '0e3ec801b5af550c8a1257e8623b1c77ac9b3d8fcfc1b2b7494e3cb77878f92a',
  space: 'wl1z0pal05vy'
});

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 0,
   backgroundColor: 'white'
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center'
  }
})
