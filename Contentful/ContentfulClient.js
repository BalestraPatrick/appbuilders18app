const { createClient } = require('../Contentful/contentful.js');
import * as constants from '../constants.js';

module.exports = class ContentfulClient {

  constructor() {
  }

  getSpeakers() {
    return client.getEntries()
    .then((entries) => {
      return this.parseSpeakers(entries);
    })
    .catch((error) => {
      console.warn(`Error in retrieving speakers: ${error}`);
    })
  }

  parseSpeakers(entries) {
    // Sort by last name
    const speakers = entries.items.sort((a, b) => a.fields.lastName > b.fields.lastName);
    const initials = new Set(entries.items.map((speaker) => speaker.fields.lastName[0]).sort());
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
}

const client = createClient({
  accessToken: constants.ACCESS_TOKEN,
  space: constants.SPACE_ID
});
