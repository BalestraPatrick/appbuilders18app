import React from 'react';
import { StyleSheet, Text, View, SectionList, Button, Image, ActivityIndicator, FlatList, RefreshControl, WebView } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StackNavigator } from 'react-navigation';
import SegmentedControlTab from 'react-native-segmented-control-tab';
const ContentfulClient = require('../Contentful/ContentfulClient');
const client = new ContentfulClient();

export default class NewsScreen extends React.Component {
  static navigationOptions = {
    title: 'News',
    tabBarLabel: 'News',
    showIcon: true,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../images/news.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isLoading: true,
      news: null,
      selectedIndex: 0
    }
  }

  componentDidMount() {
    client.getNews().then(news => {
      this.setState({
        isLoading: false,
        news: news
      });
    });
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    });
    client.getNews().then(() => {
      this.setState({
        refreshing: false
      });
    });
  }

  handleIndexChange(index) {
    this.setState({
      selectedIndex: index
    });
  }

  twitter(username) {
    return `<!DOCTYPE HTML>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
      </head>
      <body>
        <a class="twitter-timeline" data-dnt="true" data-link-color="#e91e63" href="https://twitter.com/${username}?ref_src=twsrc%5Etfw"></a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </body>
    </html>`
  }

  renderTalk(item) {
    return (
      <View style={styles.newsContainer}>
          <View style={styles.newsInformation}>
            <Text style={styles.title}>{item.fields.title}</Text>
            <Text style={styles.newsDate}>16 Apr 10:18</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.content}>{item.fields.content}</Text>
          </View>
      </View>
    )
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
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
            values={['Posts', 'Twitter']}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange.bind(this)}
          />
        </View>
        {this.state.selectedIndex == 0 ? (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />
            }
            data={this.state.news}
            renderItem={({item}) => this.renderTalk(item)}
            keyExtractor={(item, index) => index}
          />
        ) : (
          <WebView style={styles.webView} source={{html: this.twitter('AppBuilders_CH')}}/>
        )
      }
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
  loadingContainer: {
    flex: 1,
    paddingTop: 20
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18
  },
  speakerTextContainer: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 10
  },
  newsInformation: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  newsContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
  },
  tabsContainerStyle: {
    margin: 10,
    width: 200
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
  webView: {
    margin: 10,
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
  }
})
