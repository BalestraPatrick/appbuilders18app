import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

export default class Speakers extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Speakers',
    showIcon: true,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../images/speaker.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Go back home"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center'
  }
})
