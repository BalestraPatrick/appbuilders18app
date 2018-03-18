import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export const TwitterButton = () => 
    <SimpleLineIcons 
        color="#e91e63" 
        name="social-twitter" 
        size={30}
        style={styles.twitterButton}
        onPress={() => 
            Linking.openURL(`https://twitter.com/${speaker.twitter}`)
        } 
    />

const styles = StyleSheet.create({
    twitterButton: {
        paddingRight: 8
    }
});