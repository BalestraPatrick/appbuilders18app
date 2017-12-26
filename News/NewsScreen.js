import React from 'react';
import { StyleSheet, Text, View, SectionList, Button, Image, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StackNavigator } from 'react-navigation';
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
      isLoading: false,
      news: null
    }
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

  componentDidMount() {
    client.getNews().then(news => {
      this.setState({
        isLoading: false,
        news: news
      });
    });
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
        <FlatList
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />
          }
          data={this.state.news}
          renderItem={({item}) => this.renderTalk(item)}
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
  newsDate: {

  }
})
