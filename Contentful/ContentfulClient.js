const { createClient } = require('../Contentful/contentful.js');
import * as constants from '../constants.js';
import firebase from 'react-native-firebase';

module.exports = class ContentfulClient {

  constructor() {
    this.ref = firebase.database().ref();

    // this.ref.once('value').then(snapshot => {
    //   console.log(JSON.stringify(snapshot.val()));
    // });
    // this.ref.then((object) => {
    //   console.log(`OBJECT: ${object}`);
    // })
    // console.log(firebase.database().ref('/news'));
  }

  getSpeakers() {
    return this.ref.child('speakers').once('value').then((snap) => {
      return this.parseSpeakers(snap.val());
    })
    .catch((error) => {
      console.warn(`Error in retrieving speakers: ${error}`);
    })
  }

  getTalks() {
    return client.getEntries({content_type: 'talk'})
    .then((entries) => {
      return this.parseTalks(entries);
    })
    .catch((error) => {
      console.warn(`Error in retrieving talks: ${error}`);
    })
  }

  getNews() {
    return client.getEntries({content_type: 'news'})
    .then((entries) => {
      return this.parseNews(entries);
    })
    .catch((error) => {
      console.warn(`Error in retrieving talks: ${error}`);
    })
  }

  parseNews(entries) {
    const speakers = entries.items;
    return new Promise((resolve, reject) => resolve(speakers));
  }

  parseSpeakers(speakers) {
    const initials = new Set(speakers.map((speaker) => speaker.lastName[0]).sort());
    let sections = [];
    // Create dictionar of speakers.
    for (speaker of speakers) {
      const initial = speaker.lastName[0];
      if (initials.has(initial)) {
        // Create new dictionary for a new speaker with an unseen initial.
        sections.push({
          title: initial,
          data: [speaker]
        });
        initials.delete(initial);
      } else {
        // Push new speakers with same last name initial.
        sections.filter((element) => element.title == initial)[0].data.push(speaker);
      }
    }
    // Sort dictionary and inner speakers in each section.
    sections = sections.sort((a, b) => a.title.localeCompare(b.title));
    for (section of sections) {
      section.data.sort((a, b) => a.lastName.localeCompare(b.lastName));
    }
    return sections;
  }

  parseTalks(entries) {
    const talks = entries.items;
    let sections = [{title: '1st Day', data: []}, {title: '2nd Day', data: []}];
    for (talk of talks) {
      const talkDate = talk.fields.time;
      if (talk.fields.isFirstDay) {
        sections[0].data.push(talk);
      } else {
        sections[1].data.push(talk);
      }
    }
    return new Promise((resolve, reject) => resolve(sections));
  }
}

const client = createClient({
  accessToken: constants.ACCESS_TOKEN,
  space: constants.SPACE_ID
});
