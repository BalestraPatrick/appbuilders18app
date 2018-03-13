import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    emptyHeaderText: {
      margin: 20,
      marginTop: 100,
      fontSize: 20,
      lineHeight: 30,
      textAlign: 'center'
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
      marginTop: 10,
      marginBottom: 10,
      maxWidth: 360,
      marginLeft: 10,
      marginRight: 10
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
  