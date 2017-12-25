import React from 'react';
import { StyleSheet, Text, View, Button, Image, AppRegistry, SectionList, ActivityIndicator } from 'react-native';
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
    const speakers = entries.items.sort((a, b) => a.fields.lastName > b.fields.lastName);
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
      <View style={styles.speakerContainer}>
        <Image style={styles.speakerImage} source={{uri: `https:${item.fields.picture.fields.file.url}`}} />
        <View style={styles.speakerTextContainer}>
          <Text style={styles.speakerName}>{item.fields.firstName} {item.fields.lastName}</Text>
          <Text style={styles.speakerInformation}>{item.fields.jobTitle} {item.fields.company}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Image style={styles.arrow} source={require('../images/arrow.png')} />
        </View>
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
   backgroundColor: 'transparent'
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
  speakerContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 15,
    paddingLeft: 5
  },
  arrow: {
    height: 25,
    paddingRight: 15,
  }
})
