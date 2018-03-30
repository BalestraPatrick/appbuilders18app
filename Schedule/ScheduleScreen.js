import React, { Component } from 'react';
import { View, Text, SectionList, Button, Image, ActivityIndicator } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';

import SegmentedControlTab from 'react-native-segmented-control-tab';

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
      headerRight: params.button,
      tabBarIcon: ({ tintColor }) => 
        <Image
          source={require('../images/schedule.png')}
          style={[styles.icon, { tintColor }]}
        />
    };
  };

  state = {
    isLoading: true,
    sections: null,
    selectedIndex: 0
  }

  componentWillMount = () => {
    this.props.navigation.setParams({ 
      button: <NowButton onPress={this.scrollToNow} />
    });
    this.reloadDataSource(
      this.deriveAggregationFromIndex(this.state.selectedIndex)
    );
  }

  reloadDataSource = groupedBy => 
    client.getTalks(groupedBy).then(talks => {
      this.setState({
        isLoading: false,
        sections: talks
      });
    }).catch(error => {
      console.log(error);
    });

  // given a conference day and a time, finds closest talk to time
  findClosestTalk = (conferenceDay, time) => {
    const sum = (a, b) => a + b;

    return this.state.sections[conferenceDay].data
      .filter(talk => time.localeCompare(talk.time) == 1)
      .reduce(sum, 0);
  }  

  scrollToNow = () => {
    moment.locale('en');
    const today = moment();
    const time = today.format("HH:mm");
    const day = today.format('D') // 16th 
    const month = today.format('M') // 4 == April
    const year = today.format('YYYY') // 2018

    let conferenceDaySectionIndex;

    // It's Monday 16th April.
    if (day == 16 && month == 4 && year == 2018) {
      conferenceDaySectionIndex = 0;
    } else if (day == 17 && month == 4 && year == 2018) {
      // It's Tuesday 17th April.
      conferenceDaySectionIndex = 1;
    } else {
      // Not App Builders today, just return.
      return;
    }
    
    let talkIndex = this.findClosestTalk(conferenceDaySectionIndex, time);

    this.talksSectionListRef.scrollToLocation({
      animated: true,
      sectionIndex: conferenceDaySectionIndex,
      itemIndex: talkIndex,
      viewOffset: 20
    });
  }

  deriveAggregationFromIndex = index => [ 'day', 'room', 'custom' ][index];

  handleIndexChange = index => {
    const nowButton = <NowButton onPress={this.scrollToNow} />;
    
    let groupedBy = this.deriveAggregationFromIndex(index);
    let button = groupedBy === 'day' || groupedBy === 'custom' ? nowButton : null;
    this.props.navigation.setParams({ button });

    this.setState({
      selectedIndex: index,
      isLoading: true
    }, () => this.reloadDataSource(groupedBy));
  }

  formatDate = dateString => moment(string).format('h:mm A');

  render = () => {
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
              renderItem={({item}) => 
                <TalkListItem 
                  talk={item} 
                  navigation={navigation} 
                  client={client}
                  onNavigate={() => this.reloadDataSource(
                    this.deriveAggregationFromIndex(this.state.selectedIndex)
                  )} 
                />
              }
              renderSectionHeader={({section}) => 
                [this.state.sections.length > 1 
                  ? <Text key="1" style={styles.sectionHeader}>{section.title}</Text> 
                  : <Text key="2" style={styles.emptyHeaderText}>
                      Plan your conference by ❤️ the talks you wish to attend.
                    </Text>
                ]
              }
              keyExtractor={(item, index) => `${index}`}
            />}
      </View>
    );
  }
}
