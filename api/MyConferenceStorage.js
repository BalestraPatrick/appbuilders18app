import { AsyncStorage } from 'react-native';

const MyConferenceStorageKey = "@AppBuilders:myConference";

module.exports = class MyConferencStorage {

  getTalks = async () => {
    try {
      // Get "My Conference" talks
      const array = await AsyncStorage.getItem(MyConferenceStorageKey);
      if (array !== null) {
        // Append or remove the talk
				return JSON.parse(array);
      } else {
				return [];
      }
    } catch (error) {
	  // Error retrieving data
	  console.error(error);
    }
  }

	swapTalk = async (id) => {
		const talks = await this.getTalks();
		const index = talks.indexOf(id);
		if (index != -1) {
			const newTalks = talks.filter((talkId) => talkId != id);
			await AsyncStorage.setItem(MyConferenceStorageKey, JSON.stringify(newTalks));
			return newTalks;
		} else {
			const newTalks = talks;
			newTalks.push(id);
			await AsyncStorage.setItem(MyConferenceStorageKey, JSON.stringify(newTalks));
			return newTalks;
		}
  }
}
