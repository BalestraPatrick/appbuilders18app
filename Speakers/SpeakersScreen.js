import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, AppRegistry, SectionList, ActivityIndicator } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
const { createClient } = require('../Contentful/contentful.js');
import * as constants from '../constants.js';

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

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      sections: null
    }
  }

  componentDidMount() {
    client.getEntries()
    .then((entries) => {
      this.parseSpeakers(entries);
    }).catch((error) => {
      console.warn(`Error in retrieving entries ${error}`);
    })
  }

  parseSpeakers(entries) {
    // Sort by last name
    const speakers = entries.items.sort((a, b) => {
      return a.fields.lastName > b.fields.lastName
    });
    const initials = new Set(entries.items.map((speaker) => speaker.fields.lastName[0]).sort());
    const sections = [];
    // Create dictionar of speakers.
    for (speaker of speakers) {
      const initial = speaker.fields.lastName[0];
      if (initials.has(initial)) {
        // Create new dictionary for a new speaker with an unseen initial.
        sections.push({
          title: initial,
          data: [speaker]
        });
        initials.delete(initial);
      } else {
        // Push new speakers with same last name initial.
        sections.filter((element) => element.title == initial)[0].data.push(speaker);
      }
    }
    sections.sort(element => element.title);
    console.log(`sections: ${JSON.stringify(sections)}`);
    this.setState({
      isLoading: false,
      sections: sections
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <SectionList
          sections={this.state.sections}
          renderItem={({item}) => <Text style={styles.item}>{item.fields.lastName}</Text>}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

const client = createClient({
  accessToken: constants.ACCESS_TOKEN,
  space: constants.SPACE_ID
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
