import React from 'react';
import { StyleSheet, Text, View, SectionList, Button, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StackNavigator } from 'react-navigation';
import SegmentedControlTab from 'react-native-segmented-control-tab';
const ContentfulClient = require('../Contentful/ContentfulClient');
const client = new ContentfulClient();

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

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      sections: null,
      selectedIndex: 0
    }
  }

  componentDidMount() {
    client.getTalks().then(talks => {
      this.setState({
        isLoading: false,
        sections: talks
      });
    });
  }

  handleIndexChange(index) {
    this.setState({
      selectedIndex: index
    });
  }

  renderTalk(item) {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity onPress={() => navigate('SpeakerDetails', item)}>
        <View style={styles.speakerContainer}>
            <Image style={styles.speakerImage} source={{uri: `https:${item.fields.speaker.fields.picture.fields.file.url}`}} />
            <View style={styles.speakerTextContainer}>
              <Text style={styles.speakerName}>{item.fields.title}</Text>
              <Text style={styles.speakerInformation}>{item.fields.content}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Image style={styles.arrow} source={require('../images/arrow.png')} />
            </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
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
        <SectionList
          sections={this.state.sections}
          renderItem={({item}) => this.renderTalk(item)}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        />
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
  speakerTextContainer: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 10
  },
  speakerImage: {
    margin: 10,
    width: 50,
    height: 50,
    borderRadius: 10
  },
  speakerName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 10
  },
  speakerInformation: {
    paddingTop: 5,
    fontSize: 18,
  },
  speakerContainer: {
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
