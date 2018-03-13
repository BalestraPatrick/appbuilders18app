import React, { Component } from 'react';
import { View, Text, SectionList, Button, Image, ActivityIndicator } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';

import SegmentedControlTab from 'react-native-segmented-control-tab';
// import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import { TalkListItem } from './TalkListItem';
import { styles } from './styles';

import moment from 'moment';
import ApiClient from '../api/ApiClient';

const client = new ApiClient();

const NowButton = ({ onPress }) => 
  <Button 
    title="Now" 
    color="#e91e63"
    onPress={onPress} 
  />

export default class ScheduleScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const  { params = {} } = navigation.state;
    return {
      title: 'Schedule',
      tabBarLabel: 'Schedule',
      showIcon: true,
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../images/schedule.png')}
          style={[styles.icon, { tintColor }]}
        />
      ),
      headerRight: params.button,
    };
  };

  state = {
    isLoading: true,
    sections: null,
    selectedIndex: 0
  }

  componentWillMount = () => {
    this.props.navigation.setParams({ 
      scrollToNow: this._scrollToNow, 
      button: <NowButton onPress={this.scrollToNow} />
    });
    client.getTalks('day').then(talks => {
      this.setState({
        isLoading: false,
        sections: talks
      });
    });
  }

  reloadDataSource = () => {
    // Reload datasource.
    const index = this.state.selectedIndex;
    let groupedBy;
    if (index == 0) {
      groupedBy = 'day';
      this.props.navigation.setParams({ button: <NowButton onPress={this.scrollToNow} /> });
    } else if (index == 1) {
      groupedBy = 'room';
      this.props.navigation.setParams({ button: null });
    } else if (index == 2) {
      groupedBy = 'custom';
      this.props.navigation.setParams({ button: <NowButton onPress={this.scrollToNow} /> });
    }
    client.getTalks(groupedBy).then(talks => {
      this.setState({
        isLoading: false,
        sections: talks
      });
    });
  }

  scrollToNow = () => {
    moment.locale('en');
    const today = moment();
    const time = today.format("HH:mm");
    const day = today.format('D') // 16th 
    const month = today.format('M') // 4 == April
    const year = today.format('YYYY') // 2018
    
    let index;
    // It's Monday 16th April.
    if (day == 16 && month == 4 && year == 2018) {
      index = 0;
    } else if (day == 17 && month == 4 && year == 2018) {
      // It's Tuesday 17th April.
      index = 1;
    } else {
      // Not App Builders today, just return.
      return;
    }
    // Find closest talk to current time.
    let row = 0;
    for (talk of this.state.sections[index].data) {
      if (time.localeCompare(talk.time) == 1) {
        row++;
      }
    }
    this.talksSectionListRef.scrollToLocation({
      animated: true,
      sectionIndex: index,
      itemIndex: row,
      viewOffset: 20
    });
  }

  handleIndexChange = (index) => {
    this.setState({
      selectedIndex: index,
      isLoading: true
    }, () => this.reloadDataSource());
  }

  formatDate(string) {
    return moment(string).format('h:mm A');
  }

  render() {

    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.segmentedControlContainer}>
          <SegmentedControlTab
            tabsContainerStyle={styles.tabsContainerStyle}
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            values={['By Day', 'By Room', 'My Conference']}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
          />
        </View>
        {this.state.isLoading 
          ? <ActivityIndicator />
          : <SectionList
              ref={ref => { this.talksSectionListRef = ref; }}
              sections={this.state.sections}
              renderItem={({item}) => <TalkListItem talk={item} navigation={navigation} client={client} />}
              renderSectionHeader={({section}) => (
                [this.state.sections.length > 1 ? (
                  <Text key="1" style={styles.sectionHeader}>{section.title}</Text>
                ) : (
                  <Text key="2" style={styles.emptyHeaderText}>
                    Plan your conference by ❤️ the talks you wish to attend.
                  </Text>
              )])}
              keyExtractor={(item, index) => index}
            />}
      </View>
    );
  }
}
