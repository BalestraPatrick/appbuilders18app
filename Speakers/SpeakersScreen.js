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
    let sections = [];
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
    // Sort dictionary and inner speakers in each section.
    sections = sections.sort((a, b) => a.title.localeCompare(b.title));
    for (section of sections) {
      section.data.sort((a, b) => a.fields.lastName.localeCompare(b.fields.lastName));
    }
    this.setState({
      isLoading: false,
      sections: sections
    });
  }

  renderSpeaker(item) {

    return (
      <View>
        <Image style={styles.speakerImage} source={{uri: `https:${item.fields.picture.fields.file.url}`}} />
        <Text style={styles.speakerName}>{item.fields.firstName} {item.fields.lastName}</Text>
        <Text style={styles.speakerInformation}>{item.fields.jobTitle} {item.fields.company}</Text>
      </View>
    )
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    console.log(this.state.sections[0].data[0].fields.picture.fields.file.url);
    return (
      <View style={styles.container}>
        <SectionList
          sections={this.state.sections}
          renderItem={({item}) => this.renderSpeaker(item)}
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
  speakerImage: {
    margin: 10,
    width: 100,
    height: 100,
    borderRadius: 10
  },
  speakerName: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold'
  },
  speakerInformation: {
    padding: 10,
    fontSize: 18,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center'
  }
})
