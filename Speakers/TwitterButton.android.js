import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const TwitterButton = () => 
    <Ionicons 
        color="#e91e63" 
        name="logo-twitter" 
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