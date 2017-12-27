import React from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView, WebView } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StackNavigator } from 'react-navigation';

export default class SpeakerDetailsScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: `${navigation.state.params.fields.firstName} ${navigation.state.params.fields.lastName}`,
      tabBarLabel: 'Speakers',
      showIcon: true,
      headerTintColor: '#e91e63',
      headerTitleStyle: { color: 'black' },
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../images/speaker.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
    }
  };

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

  render() {
    const fields = this.props.navigation.state.params.fields;
    return (
      <ScrollView style={styles.viewContainer}>
        <View style={styles.informationContainer}>
          <View style={styles.speakerContainer}>
            <Image style={styles.speakerImage} source={{uri: `https:${fields.picture.fields.file.url}`}} />
            <View style={styles.speakerTextContainer}>
              <Text style={styles.speakerName}>{fields.firstName} {fields.lastName}</Text>
              <Text style={styles.speakerInformation}>{fields.jobTitle} {fields.company}</Text>
            </View>
          </View>
          <Text style={styles.speakerBiography}>{fields.biography}</Text>
          <WebView style={styles.webView} source={{html: this.twitter(fields.twitter)}}/>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: 'transparent',
  },
  informationContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
    margin: 10,
  },
  webView: {
    height: 400,
    shadowRadius: 10,
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
    width: 75,
    height: 75,
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
  speakerBiography: {
    margin: 10
  },
  speakerContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
})
