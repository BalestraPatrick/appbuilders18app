import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';

export default class TalkScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: `${navigation.state.params.talk.title}`,
      tabBarLabel: 'Schedule',
      showIcon: true,
      headerTintColor: '#e91e63',
      headerTitleStyle: { color: 'black' },
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../images/schedule.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
      headerRight: (
        <TouchableOpacity onPress={params.addToMyConference} style={{marginRight: 10}}>
          <Image
            source={params.likeButton || require('../images/like.png')}
            style={[styles.icon, {tintColor: '#e91e63'}]}
          />
        </TouchableOpacity>
      ),
    }
  };
  
  componentWillMount = () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    
    params.client.getLikes().then(speakerIds => {
      const { speakerId } = params.talk.speaker;
      this.setState({ speakerIds, speakerId });
      
      navigation.setParams({
        addToMyConference: this.addToMyConference, 
        likeButton: speakerIds.indexOf(speakerId) !== -1 
          ? require('../images/liked.png')
          : require('../images/like.png')
      });
    });
  }

  addToMyConference = () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const { speakerId } = params.talk.speaker;
    
    if (this.state.speakerIds.indexOf(speakerId) === -1) {
      this.state.speakerIds.push(speakerId);
      navigation.setParams({ 
        likeButton: require('../images/liked.png')
      });
    } else {
      this.state.speakerIds = this.state.speakerIds.filter(id => id !== speakerId);
      navigation.setParams({ 
        likeButton: require('../images/like.png')
      });
    }
    params.client.setLikes(this.state.speakerIds);
    params.reloadDataSource();
  }

  render() {
    const { talk } = this.props.navigation.state.params;
    return (
      <ScrollView style={styles.viewContainer}>
        <View style={styles.informationContainer}>
          <View style={styles.speakerContainer}>
            <Image style={styles.speakerImage} source={{uri: talk.speaker.picture}} />
            <View style={styles.speakerTextContainer}>
              <Text style={styles.speakerName}>{talk.speaker.firstName} {talk.speaker.lastName}</Text>
              <Text style={styles.speakerInformation}>{talk.speaker.jobTitle} {talk.speaker.company}</Text>
            </View>
          </View>
          <Text style={styles.talkTitle}>{talk.title}</Text>
          <Text style={styles.speakerBiography}>{talk.description}</Text>
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
    fontSize: 20,
  },
  speakerBiography: {
    margin: 10
  },
  talkTitle: {
    margin: 10,
    fontWeight: 'bold',
    fontSize: 22
  },
  speakerContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
})
