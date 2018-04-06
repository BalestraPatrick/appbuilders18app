import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const TwitterButton = (props) => 
    <Ionicons 
        color="#e91e63" 
        name="logo-twitter" 
        size={30}
        style={styles.twitterButton}
        onPress={() => 
            Linking.openURL(`https://twitter.com/${props.speaker}`)
        } 
    />

const styles = StyleSheet.create({
    twitterButton: {
        paddingRight: 8
    }
});
