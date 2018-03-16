import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { styles } from './styles';

export class TalkWithSpeaker extends Component {

    navigateToTalk = talk => {
      const { navigation, client, onNavigate } = this.props;
      return navigation.navigate('Talk', {
        talk,
        client,
        reloadDataSource: onNavigate
      }); 
    }
  
    handleTalkPress = () => {
      const { talk } = this.props;
      return this.navigateToTalk(talk);
    }
  
    render = () => {
      const { talk, speaker } = this.props;
  
      return (
        <TouchableOpacity onPress={this.handleTalkPress}>
          <View style={styles.talkMainContainer}>
            <View style={styles.talkContainer}>
              <View style={styles.speakerContainer}>
                { speaker.picture 
                  ? <Image style={styles.speakerImage} source={{ uri: speaker.picture }} />
                  : null}
                <View style={styles.talkTextContainer}>
                  <Text style={styles.talkTitle}>{talk.title}</Text>
                  <Text style={styles.talkSpeaker}>{speaker.firstName} {speaker.lastName}</Text>
                </View>
              </View>
              <Text style={styles.talkInformation}>{talk.time} | {talk.room}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Image style={styles.arrow} source={require('../images/arrow.png')} />
            </View>
          </View>
        </TouchableOpacity>
      );  
    }
  }