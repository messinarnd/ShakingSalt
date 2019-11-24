import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import Searchbar from "./Searchbar";
import {ListItem} from 'react-native-elements';
import { searchResultsEndpoint, axiosConfig } from "../../services/USDAFoodService";
import { retrieveRecentlySearchedData, storeRecentlySearchedData, storeSearchResults } from "../../services/LocalStorageService";
const axios = require("axios");

export default SearchPage = (props) => {
	// Get navigation from props (automatically added to props by stack navigator in navigation file)
	const { navigation } = props;

	// Retrieve the recently searched items on the first opening of the app
	const [recentlySearchedItems, setRecentlySearchedItems] = useState([]);
	useEffect(() => {
		retrieveRecentlySearchedData()
			.then((resp) => {
				setRecentlySearchedItems(resp);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	// Update the view anytime recentlySearchedItems is changed
	useEffect(() => {}, [recentlySearchedItems])
	

	// Used when search for a food item
	// 		- adds to local storage (recently searched and search results)
	// 		- navigates to Search Results Page
    searchItem = async (foodItem) => {
		let postData = {
			generalSearchInput: foodItem
		}

		axios.post(searchResultsEndpoint, postData, axiosConfig).then((response) => {
			if (response["data"]["totalHits"] != 0) {
				// Add to recently searched and update state
				storeRecentlySearchedData(foodItem).then(() => {
					retrieveRecentlySearchedData().then((resp) => {
						setRecentlySearchedItems(resp);
					}).catch((err) => {
						console.log(err);
					});	
				}).catch((error) => {
					console.log(error);
				})
				
				let searchResults = response["data"]["foods"];
				storeSearchResults(searchResults);
				navigation.navigate('SearchResultsPage', {
					foodItems: response["data"]["foods"]
				})
			} else {
				alert('No result found for search input ' + foodItem.toString());
			}
		}).catch((err) => {
			console.log(err);
		});
	}

	// For when there's no recently searched items (used by FlatList component)
	showEmptyComponent = () => {
		return (
			<View>
				<Text style={styles.emptyMessageStyle}>No Recent Searches!</Text>
			</View>
		)
	}
	
	return (
        <View style={styles.container}>
          <Searchbar searchItem={this.searchItem}/>

          {/* RECENTLY SEARCHED */}
          <ScrollView style={styles.container}
            contentContainerStyle={styles.contentContainer}>
            <View style={styles.MainContainer}>
              <FlatList
				data = {recentlySearchedItems}
                ListEmptyComponent={this.showEmptyComponent}
				renderItem={({item}) =>
					<ListItem title={item.searchedText} onPress={() => searchItem(item.searchedText)}/>
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </ScrollView>
        </View>
	);
}

SearchPage.navigationOptions = {
	title: 'Search',
};
  
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	contentContainer: {
		paddingTop: 30,
	},
	welcomeContainer: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20,
	}
});


// SearchPage TODOs:
// TODO: Implement removing recently searched item
// TODO: Have recently searched items show up in chronological order
// 		- most recently searched at top
// 		- will have to edit the storeRecentlySearchedData function so that it removes the first duplicate and adds it back (to maintain chronological order)
// TODO: Implement FlatListItemSeparator and add "ItemSeparatorComponent = {this.FlatListItemSeparator}" to FlatList props
// TODO: Make the UI look good