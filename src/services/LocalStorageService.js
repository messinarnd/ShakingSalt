import { AsyncStorage } from 'react-native';

const REC_SEARCHED_STORAGE_KEY = 'REC_SEARCHED_ITEMS_STORAGE';
const SEARCH_RESULTS_STORAGE_KEY = 'SEARCH_RESULTS';
const LOG_ITEMS_STORAGE_KEY = 'LOG_ITEMS_STORAGE';

// Function for reading the recently searched items from local storage (reading)
export const retrieveRecentlySearchedData = async() => {
    // await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
    try {
        // Retrieve recently searched items and parse the JSON
        const retrievedItem = await AsyncStorage.getItem(REC_SEARCHED_STORAGE_KEY);
        let itemsToJson = JSON.parse(retrievedItem);
        if (!itemsToJson) {
          itemsToJson = [];
        }
        return itemsToJson;
    } catch (error) {
        console.log(error.message);
    }
};

export const removeRecentlySearchedData = async (timestamp) => {
	try {
		const retrievedItem = await AsyncStorage.getItem(REC_SEARCHED_STORAGE_KEY);
        let itemsToJson = JSON.parse(retrievedItem);
		filteredData = itemsToJson.filter(item => item.timestamp !== timestamp);

		await AsyncStorage.setItem(REC_SEARCHED_STORAGE_KEY, JSON.stringify(filteredData)).then(() => console.log('Removed item from recently searched'));		
	} catch (error) {
		console.log(error.message);
	}
}

// Function for storing a recently searched item in local storage (writing)
export const storeRecentlySearchedData = async (foodItem) => {
    // await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
    try {
      // Making sure allRecSearchedItems array is initialized in the beginning
      const existingSearches = await AsyncStorage.getItem(REC_SEARCHED_STORAGE_KEY);
      let allRecSearchedItems = JSON.parse(existingSearches);
      if (!allRecSearchedItems) {
        allRecSearchedItems = []
      }

        // Declared as a JSON object for future expansion
        let recSearchItem = {
            // Formatting searched string as Capitalized on first character only
            searchedText: foodItem.charAt(0).toUpperCase() + foodItem.slice(1).toLowerCase(),
            timestamp: new Date().getTime()
        }

        // Adding the item to the JSON array if it doesn't already exist (better UI)
        for (let i = 0; i < allRecSearchedItems.length; i++) {
            // Compare only based off of searched string and not the entire object since time is always different
            // NOTE: might not need the lowerCase conversion anymore since input as formatted above, but this is defensive programming (kinda) fam
            if (JSON.stringify(allRecSearchedItems[i].searchedText.toLowerCase()) === JSON.stringify(recSearchItem.searchedText.toLowerCase())) {
                console.log("storeRecentlySearchedData(): found duplicate, removing and re-adding..");
                allRecSearchedItems.splice(i, 1); // Removing duplicate at index i (will be added with a new timestamp again)
                break;
            }
        }
        // Adding the new timestamped data item
        allRecSearchedItems.push(recSearchItem);

      // console.log('Current recently searched DB:')
      // console.log(allRecSearchedItems);
      await AsyncStorage.setItem(REC_SEARCHED_STORAGE_KEY, JSON.stringify(allRecSearchedItems)).then(() => console.log('Recently Searched Logged!: ', foodItem));
    } catch (error) {
      console.log(error.message);
    }
};

// Read our previous search results from AsyncStorage
export const retrieveSearchResults = async (fdcId) => {
    console.log('Fetching searched food list');
    try {
	  const savedList = await AsyncStorage.getItem(SEARCH_RESULTS_STORAGE_KEY);
	  let retVal;
      if (savedList !== null) {
        let searchResults = JSON.parse(savedList);
		let id = fdcId;
		retVal = searchResults.filter((value, index, arr) => {
			return value.fdcId != id;
		});
      } else {
		retVal = [];
	  }
	  return retVal;
    } catch (error) {
      console.log(error.message);
    }
  }


// Function for storing the most recent search results (list of food items from USDA database)
// The search results are used again when finding the list of alternatives to avoid making unnecessary requests
export const storeSearchResults = async (searchResults) => {
    // await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
    AsyncStorage.setItem(SEARCH_RESULTS_STORAGE_KEY, JSON.stringify(searchResults));
};


// Function for reading the local storage logged items
export const retrieveFoodLog = async() => {
    // await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
    // console.log('Retrieving logged data..');
    try {
		const retrievedItem = await AsyncStorage.getItem(LOG_ITEMS_STORAGE_KEY);
		let retVal = {};
		if (retrievedItem) {
			retVal = JSON.parse(retrievedItem);
        }
		return retVal;
    } catch (error) {
		console.log(error.message);
    }
}


// Function for logging food info when user clicks on the log item button
export const storeFoodLog = async (foodDetails, servingSize, servingAmount, nutrientsObj) => {
    // The food logs should look like:
	// {
	//   'yyyy': {
	//     'mm': {
	//       'dd': {
	//         'timestamp': {
	//           'food name': {
	//             // This is where the actual log will go
	//             // definitely need all nutrition info, name of item, fdcId, not sure what else
	//           }
	//         },
	//         'totals': {
	//           // Put the daily totals for all nutrients here (make sure to update this after each time logging)
	//         }
	//       },
	//       'totals': {
	//         // Put monthly totals for all nutrients here (make sure to update this after each time logging)
	//       }
	//     },
	//     'MM': {
	//       ...
	//     },
	//     'totals': {
	//       // Put yearly totals for all nutrients here (make sure to update this after each time logging)
	//     }
	//   },
	//   'YYYY': {
	//     ...
	//   }
	// }


	// await AsyncStorage.clear(); // FOR DEBUG ONLY - SHOULD BE COMMENTED
	console.log("Logging new item..");
	try {
		// Get current logs
		const existingLogs = await AsyncStorage.getItem(LOG_ITEMS_STORAGE_KEY);
		let allLogs = JSON.parse(existingLogs);
		if (!allLogs) {
			console.log("No logs found. Creating new empty logs object.");
			updated_logs = createLogTemplate(foodDetails, servingSize, servingAmount, nutrientsObj);
		} else {
            console.log("Existing logs. Adding new entry");
            updated_logs = updateLogs(allLogs, foodDetails, servingSize, servingAmount, nutrientsObj);
        }
		// console.log('Updated log DB: ', updated_logs)
		return await AsyncStorage.setItem(LOG_ITEMS_STORAGE_KEY, JSON.stringify(updated_logs)).then(() => alert('Logged!'));
	} catch (error) {
		console.log(error.message);
	}
};

createLogTemplate = (foodDetails, servingSize, servingAmount, nutrientsObj) => {
    // Get time information and create new log entry
    let date = new Date(); // new date object for getting timestamp properties
    let timestamp = date.getTime();
	let day = twoDigitFormat(date.getDate());
	let month = twoDigitFormat(date.getMonth() + 1);
	let year = date.getFullYear();
	let hours = twoDigitFormat(date.getHours());
	let min = twoDigitFormat(date.getMinutes());
	let sec = twoDigitFormat(date.getSeconds());
    let formattedDateTime = month + '/' + day + '/' + year + ' ' + hours + ':' + min + ':' + sec;

    let theLog = createLog(foodDetails, servingSize, servingAmount, nutrientsObj, formattedDateTime);

    allLogs = {};
    allLogs[year] = {};
    allLogs[year][month] = {};
    allLogs[year][month][day] = {};
    allLogs[year][month][day][timestamp] = theLog;
    allLogs[year][month][day]["totals"] = nutrientsObj;
    allLogs[year][month]["totals"] = nutrientsObj;
    allLogs[year]["totals"] = nutrientsObj;

    return allLogs;
}

updateLogs = (allLogs, foodDetails, servingSize, servingAmount, nutrientsObj) => {
	console.log("before any updating: ", allLogs);
	// Get time information and create new log entry
    let date = new Date(); // new date object for getting timestamp properties
    let timestamp = date.getTime();
    let day = twoDigitFormat(date.getDate());
	let month = twoDigitFormat(date.getMonth() + 1);
	let year = date.getFullYear();
	let hours = twoDigitFormat(date.getHours());
	let min = twoDigitFormat(date.getMinutes());
	let sec = twoDigitFormat(date.getSeconds());
	let formattedDateTime = month + '/' + day + '/' + year + ' ' + hours + ':' + min + ':' + sec;
    let log = createLog(foodDetails, servingSize, servingAmount, nutrientsObj, formattedDateTime);

	console.log("in here3")
	// Update totals for old logs
	if (allLogs[year]) {
		console.log("in here4")
		// Update the yearly total and move on to month
        console.log("before yearly1: ", allLogs[year]["totals"]);
        allLogs[year]["totals"] = updateTotals(allLogs[year]["totals"], nutrientsObj);
		console.log("after yearly: ", allLogs[year]["totals"]);

		if (allLogs[year][month]) {
			// Update the monthly total and move on to day
			console.log("before monthly: ", allLogs[year][month]["totals"]);
			allLogs[year][month]["totals"] = updateTotals(allLogs[year][month]["totals"], nutrientsObj);
			console.log("after monthly: ", allLogs[year][month]["totals"]);

			if (allLogs[year][month][day]) {
				// Update the daily total
				console.log("before daily: ", allLogs[year][month][day]["totals"]);
				allLogs[year][month][day]["totals"] = updateTotals(allLogs[year][month][day]["totals"], nutrientsObj);
				console.log("after daily: ", allLogs[year][month][day]["totals"]);
			} else {
				// Add a new daily total category - should just be nutrientsObj now
				allLogs[year][month][day] = {};
				allLogs[year][month][day]["totals"] = nutrientsObj;
			}
		} else {
			// Add a new monthly and daily total category - should just be nutrientsObj now
			allLogs[year][month] = {};
			allLogs[year][month][day] = {};
			allLogs[year][month][day]["totals"] = nutrientsObj;
			allLogs[year][month]["totals"] = nutrientsObj;
		}
	} else {
		console.log("in here5")
		// Add a new yearly, monthly, and daily total category - should just be nutrientsObj now
		allLogs[year] = {};
		allLogs[year][month] = {};
		allLogs[year][month][day] = {};
		allLogs[year][month][day]["totals"] = nutrientsObj;
		allLogs[year][month]["totals"] = nutrientsObj;
		allLogs[year]["totals"] = nutrientsObj;
	}

	// Add log to logs - use the formatted timestamp string as the key
	allLogs[year][month][day][timestamp] = log;
	console.log("after all updating: ", allLogs);
	return allLogs;
}

twoDigitFormat = (num) => {
	return (num<10 ? '0'+num : num);
}

createLog = (foodDetails, servingSize, servingAmount, nutrientsObj, formattedDateTime) => {
	var log = {
		'type': 'logs',
		'description': foodDetails.description,
		'formattedTime':formattedDateTime,
		// logTimeStamp: formattedDateTime,
		'fdcId': foodDetails.fdcId,
		// logFdcId: foodDetails.fdcId,
		'brandedFoodCategory': foodDetails.brandedFoodCategory,
		// logBrandedFoodCategory: foodDetails.brandedFoodCategory,
		'brandOwner': foodDetails.brandOwner,
		// logBrandOwner: foodDetails.brandOwner,
		'servingSize': servingSize,
		// logServingSize: servingSize,
		'servingAmount': servingAmount,
		// logServingAmount: servingAmount,
		'nutrients': nutrientsObj
	};
	return log;
}

updateTotals = (totalObj, nutrientsObj) => {
	// let totalObj = logsToUpdate['totals']; // this should now be a nutrients object with all running yearly totals
	console.log("old yearly total: ", totalObj);
	let totalObjCopy = {...totalObj};
	let newTotalObj = Object.keys(totalObjCopy).reduce((obj, nutrientName) => {
		let updatedAmount = totalObjCopy[nutrientName]["amount"] + nutrientsObj[nutrientName]["amount"]; // Add the new log amount to totals
		let updatedUnit = totalObjCopy[nutrientName]["unit"];
		temp = {
			"amount": updatedAmount,
			"unit": updatedUnit
		}
		obj[nutrientName] = temp;
		return obj;
	}, {});
	console.log("updating yearly total: ", newTotalObj);
	return newTotalObj;
}