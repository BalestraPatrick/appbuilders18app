import firebase from 'react-native-firebase';

module.exports = class ApiClient {

  constructor() {
    // firebase.database().goOffline();
    this.firestore = firebase.firestore();
    this.speakers = [];
    firebase.auth().signInAnonymously().then(() => {
      console.log(`current user: ${firebase.auth().currentUser.uid}`);
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
    const speakerIds = likes.data().speakerIds;
    return speakerIds;
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
    // Generate keys of two sections.
    if (groupedBy == 'day') {
      keys = new Set(talks.map((talk) => talk.day).sort());
    } else if (groupedBy == 'room') {
      keys = new Set(talks.map((talk) => talk.room).sort());
      console.dir(keys);
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
      } else if (groupedBy == 'room') {
        index = keysArray.indexOf(talk.room);
      } else if (groupedBy == 'custom') {
        // TODO: modify here
        this.getSavedTalks().then(talks => {
          console.log(`retrieved talks: ${JSON.stringify(savedTalks)}`);
        });
        
        index = keysArray.indexOf(talk.room);
      }
      sections[index].data.push(talk);
    }
    // console.log(`sections: ${JSON.stringify(sections)}`);
    return new Promise((resolve, reject) => resolve(sections));
  }
}
