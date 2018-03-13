import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export const TalkWithoutSpeaker = ({ talk }) => (
    <View style={styles.talkMainContainer}>
      <View style={styles.talkContainer}>
        <View style={styles.speakerContainer}>
          <View style={styles.talkTextContainer}>
            <Text style={styles.talkTitle}>{talk.title}</Text>
          </View>
        </View>
        <Text style={styles.talkInformation}>{talk.time} | {talk.room}</Text>
      </View>
    </View>
  );