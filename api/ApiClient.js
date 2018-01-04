import firebase from 'react-native-firebase';

module.exports = class ApiClient {

  constructor() {
    // firebase.database().goOffline();
    this.firestore = firebase.firestore();
    this.speakers = [];
  }

  getSpeakers() {
    return this.firestore.collection('speakers').get().then(snap => {
      return this.parseSpeakers(snap.docs.map(doc => doc.data()));
    })
    .catch(error => {
      console.warn(`Error in retrieving speakers: ${error}`);
      return error;
    });
  }

  getTalks(groupedBy) {
    return this.getSpeakers().then(result => {
      return this.firestore.collection('talks').get();
    })
    .then(snap => {
      return this.parseTalks(snap.docs.map(doc => doc.data()), groupedBy);
    })
    .catch(error => {
      console.warn(`Error in retrieving talks: ${error}`);
      return error;
    });
  }

  getNews() {
    return this.firestore.collection('news').get().then(snap => {
      return snap.docs.map(doc => doc.data());
    })
    .catch(error => {
      console.warn(`Error in retrieving news: ${error}`);
      return error;
    });
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
    this.speakers = speakers;
    return sections;
  }

  parseTalks(talks, groupedBy) {
    let sections = [];
    let keys;
    if (groupedBy == 'day') {
      keys = new Set(talks.map((talk) => talk.day).sort());
    } else if (groupedBy == 'room') {
      keys = new Set(talks.map((talk) => talk.room).sort());
    } else {
      console.error("Unrecognized `groupedBy` key.");
    }
    for (key of keys) {
      sections.push({title: key, data: []});
    }

    let keysArray = sections.map(object => object.title);
    for (talk of talks) {
      talk.speaker = this.speakers.filter(speaker => speaker.speakerId == talk.speaker)[0];

      let index;
      if (groupedBy == 'day') {
        index = keysArray.indexOf(talk.day);
      } else if (groupedBy == 'room') {
        index = keysArray.indexOf(talk.room);
      }
      sections[index].data.push(talk);
    }
    return new Promise((resolve, reject) => resolve(sections));
  }
}
