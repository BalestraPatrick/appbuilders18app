const { createClient } = require('../Contentful/contentful.js');
import * as constants from '../constants.js';

module.exports = class ContentfulClient {

  constructor() {
  }

  getSpeakers() {
    return client.getEntries({content_type: 'speaker'})
    .then((entries) => {
      return this.parseSpeakers(entries);
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

  parseSpeakers(entries) {
    const speakers = entries.items;
    const initials = new Set(speakers.map((speaker) => speaker.fields.lastName[0]).sort());
    let sections = [];
    // Create dictionar of speakers.
    for (speaker of speakers) {
      const initial = speaker.fields.lastName[0];
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
      section.data.sort((a, b) => a.fields.lastName.localeCompare(b.fields.lastName));
    }
    return new Promise((resolve, reject) => resolve(sections));
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
