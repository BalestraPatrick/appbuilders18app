import React from 'react';
import { StyleSheet, Text, View, Image, SectionList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TabNavigator } from 'react-navigation';
const ApiClient = require('../api/ApiClient');
const client = new ApiClient();

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
    client.getSpeakers().then(speakers => {
      this.setState({
        isLoading: false,
        sections: speakers
      });
    });
  }

  renderSpeaker(item) {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity onPress={() => navigate('SpeakerDetails', item)}>
        <View style={styles.speakerContainer}>
            <Image style={styles.speakerImage} source={{uri: item.picture}} />
            <View style={styles.speakerTextContainer}>
              <Text style={styles.speakerName}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.speakerInformation}>{item.jobTitle} {item.company}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Image style={styles.arrow} source={require('../images/arrow.png')} />
            </View>
        </View>
      </TouchableOpacity>
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
