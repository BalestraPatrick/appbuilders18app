import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';

export default class ScheduleScreen extends React.Component {
  static navigationOptions = {
    title: 'Schedule',
    tabBarLabel: 'Schedule',
    showIcon: true,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../images/schedule.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={styles.safeArea}>
        <Button
          onPress={() => navigate('Talk')}
          title="View Talk Details"
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
