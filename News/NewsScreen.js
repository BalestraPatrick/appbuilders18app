import React from 'react';
import { StyleSheet, Text, View, SectionList, Button, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
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
      isLoading: true,
      sections: null
    }
  }

  componentDidMount() {
    // client.getTalks().then(talks => {
    //   console.log(`GOT TALKS: ${JSON.stringify(talks, null, 2)}`);
    //   this.setState({
    //     isLoading: false,
    //     sections: talks
    //   });
    // });
  }

  renderTalk(item) {
    // const { navigate } = this.props.navigation;
    // return (
    //   <TouchableOpacity onPress={() => navigate('SpeakerDetails', item)}>
    //     <View>
    //       <Text>Ciao</Text>
    //     </View>
    //   </TouchableOpacity>
    // )
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    // return (
    //   <View style={styles.container}>
    //     <SectionList
    //       sections={this.state.sections}
    //       renderItem={({item}) => this.renderTalk(item)}
    //       renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
    //       keyExtractor={(item, index) => index}
    //     />
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center'
  }
})
