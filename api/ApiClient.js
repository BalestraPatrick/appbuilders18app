import firebase from 'react-native-firebase';

module.exports = class ApiClient {

  constructor() {
    // firebase.database().goOffline();
    this.firestore = firebase.firestore();
    this.speakers = [];
    this.likes = [];
    firebase.auth().signInAnonymously().then(() => {
      console.log(`current user: ${firebase.auth().currentUser.uid}`);
      this.getSpeakers();
      this.getLikes();
    });
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

  getLikes() {
    return this.firestore.doc(`likes/${firebase.auth().currentUser.uid}`).get().then(snap => {
      return this.parseLikes(snap);
    })
    .catch(error => {
      console.warn(`Error in retrieving likes: ${error}`);
      return error;
    });
  }

  setLikes(speakerIds) {
    this.firestore.doc(`likes/${firebase.auth().currentUser.uid}`).set({speakerIds: speakerIds});
    this.likes = speakerIds;
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

  // Parsing Functions

  parseLikes(likes) {
    const data = likes.data();
    let speakerIds;
    if (data !== undefined) {
      speakerIds = likes.data().speakerIds.sort();
    } else {
      speakerIds = [];
    }
    this.likes = speakerIds;
    return speakerIds;
  }

  parseSpeakers(speakers) {
    const initials = new Set(speakers.map((speaker) => speaker.lastName[0]).sort());
    let sections = [];
    // Create dictionary of speakers.
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
    // Generate keys of two sections.
    if (groupedBy == 'day') {
      keys = new Set(talks.map((talk) => talk.day).sort());
    } else if (groupedBy == 'room') {
      keys = new Set(talks.map((talk) => talk.room).sort());
    } else if (groupedBy == 'custom') {
      keys = new Set(talks.map((talk) => talk.day).sort());
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
        sections[index].data.push(talk);
      } else if (groupedBy == 'room') {
        index = keysArray.indexOf(talk.room);
        sections[index].data.push(talk);
      } else if (groupedBy == 'custom') {
        // Check if this talk is inside the liked talks array.
        if (this.likes.indexOf(talk.speaker.speakerId) != -1) {
          index = keysArray.indexOf(talk.day);
          sections[index].data.push(talk);
        }
      }
    }
    return new Promise((resolve, reject) => resolve(sections));
  }
}
