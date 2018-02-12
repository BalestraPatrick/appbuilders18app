import React from 'react';
import { StyleSheet, Text, View, SectionList, Button, Image, ActivityIndicator, TouchableOpacity, TouchableHighlight } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StackNavigator } from 'react-navigation';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import moment from 'moment';
const ApiClient = require('../api/ApiClient');
const client = new ApiClient();

export default class ScheduleScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: 'Schedule',
      tabBarLabel: 'Schedule',
      showIcon: true,
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../images/schedule.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
      headerRight: (
        <Button title="Now" color="#e91e63" onPress={() => params.scrollToNow()}></Button>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      sections: null,
      selectedIndex: 0
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({ scrollToNow: this._scrollToNow });

    client.getTalks('day').then(talks => {
      this.setState({
        isLoading: false,
        sections: talks
      });
    });
  }

  _scrollToNow = () => {
    // TODO: scroll to now
  }

  handleIndexChange(index) {
    this.setState({
      selectedIndex: index,
      isLoading: true
    });
    // Reload datasource.
    let groupedBy;
    if (index == 0) {
      groupedBy = 'day';
    } else if (index == 1) {
      groupedBy = 'room';
    } else if (index == 2) {
      groupedBy = 'custom';
    }
    client.getTalks(groupedBy).then(talks => {
      this.setState({
        isLoading: false,
        sections: talks
      });
    });
  }

  formatDate(string) {
    return moment(string).format('h:mm A');
  }

  renderTalk(talk) {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity onPress={() => navigate('Talk', talk)}>
        <View style={styles.talkMainContainer}>
          <View style={styles.talkContainer}>
            <View style={styles.speakerContainer}>
                <Image style={styles.speakerImage} source={{uri: talk.speaker.picture}} />
                <View style={styles.talkTextContainer}>
                  <Text style={styles.talkTitle}>{talk.title}</Text>
                  <Text style={styles.talkSpeaker}>{talk.speaker.firstName} {talk.speaker.lastName}</Text>
                </View>
            </View>
            <Text style={styles.talkInformation}>{talk.time} | {talk.room}</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Image style={styles.arrow} source={require('../images/arrow.png')} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
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
            onTabPress={this.handleIndexChange.bind(this)}
          />
        </View>
        {this.state.isLoading ? (
          <ActivityIndicator />
        ) : (
          <SectionList
            sections={this.state.sections}
            renderItem={({item}) => this.renderTalk(item)}
            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
            keyExtractor={(item, index) => index}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 0,
   backgroundColor: 'transparent'
  },
  talkMainContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
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
  talkTextContainer: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 10
  },
  speakerImage: {
    marginRight: 10,
    width: 50,
    height: 50,
    borderRadius: 10
  },
  talkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 10,
    fontSize: 18
  },
  talkSpeaker: {
    paddingTop: 5,
    fontSize: 16,
  },
  talkInformation: {
    margin: 10,
    marginTop: 0,
  },
  talkContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  speakerContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 15,
    paddingLeft: 5
  },
  arrow: {
    height: 25,
    paddingRight: 15,
  },
  tabsContainerStyle: {
    margin: 10,
    width: 325
  },
  tabStyle: {
    backgroundColor: 'transparent',
    borderColor: '#e91e63'
  },
  tabTextStyle: {
    color: '#e91e63'
  },
  activeTabStyle: {
    backgroundColor: '#e91e63'
  },
  segmentedControlContainer: {
    alignItems: 'center'
  },
})
