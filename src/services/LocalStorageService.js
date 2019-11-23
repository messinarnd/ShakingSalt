import { AsyncStorage } from 'react-native';

const REC_SEARCHED_STORAGE_KEY = 'REC_SEARCHED_ITEMS_STORAGE';
const SEARCH_RESULTS_KEY = 'SEARCH_RESULTS';

// Function for reading the recently searched items from local storage (reading)
export const retrieveRecentlySearchedData = async() => {
    // await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
    // console.log('Retrieving recently searched data..');
    try {
      const retrievedItem = await AsyncStorage.getItem(REC_SEARCHED_STORAGE_KEY);
      console.log("Recently searched items: ", retrievedItem);

      let itemsToJson = JSON.parse(retrievedItem);
      return itemsToJson;
    } catch (error) {
      console.log(error.message);
    }
};


// Function for storing a recently searched item in local storage (writing)
export const storeRecentlySearchedData = async (foodItem) => {
    // await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
    // console.log("Storing rec searched item..");
    // console.log(foodItem);

    try {
      // Making sure allRecSearchedItems array is initialized in the beginning
      const existingSearches = await AsyncStorage.getItem(REC_SEARCHED_STORAGE_KEY);
      let allRecSearchedItems = JSON.parse(existingSearches);
      if (!allRecSearchedItems) {
        allRecSearchedItems = []
      }

      // Declared as a JSON object for future expansion
      var recSearchItem = {
        searchedText: foodItem
      }

      // Adding the item to the JSON array if it doesn't already exist (better UI)
      var duplicate = false;
      for (var i = 0; i < allRecSearchedItems.length; i++) {
        if (JSON.stringify(allRecSearchedItems[i]) === JSON.stringify(recSearchItem)) {
          duplicate = true;
          break;
        }
      }

      if (!duplicate) {
        allRecSearchedItems.push(recSearchItem);
      } else {
        console.log("Duplicate found. Not adding to recently searched array.");
      }

      // console.log('Current recently searched DB:')
      // console.log(allRecSearchedItems);
      await AsyncStorage.setItem(REC_SEARCHED_STORAGE_KEY, JSON.stringify(allRecSearchedItems)).then(() => console.log('Recently Searched Logged!: ', foodItem));
    } catch (error) {
      console.log(error.message);
    }
};


// Function for storing the most recent search results (list of food items from USDA database)
// The search results are used again when finding the list of alternatives to avoid making unnecessary requests
export const storeSearchResults = async (searchResults) => {
    // await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
    // console.log("Storing search results..");
    // console.log(searchResults);

    AsyncStorage.setItem("SEARCH_RESULTS", JSON.stringify(searchResults));
};