import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList } from 'react-native';
import { Title } from 'native-base';

import SwipeView from 'react-native-swipeview';
import Searchbar from "./Searchbar";
import {ListItem} from 'react-native-elements';
import { searchResultsEndpoint, axiosConfig } from "../../services/USDAFoodService";
import { retrieveRecentlySearchedData, storeRecentlySearchedData, storeSearchResults, removeRecentlySearchedData } from "../../services/LocalStorageService";
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
			<View style={{flex:1, padding:10, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
				<Text style={styles.emptyMessageStyle}>No recent searches! Try searching above!</Text>
			</View>
		)
	}

	// Remove this item from the async storage based on the timestamp passed in
	// TODO: USE IDs instead
	deleteItemByTimestamp = (timestamp) => {
		removeRecentlySearchedData(timestamp).then(() => {
			retrieveRecentlySearchedData().then((resp) => {
				console.log("here: ", resp)
				setRecentlySearchedItems(resp);
			});
		});
	}
	
	return (
        <View style={styles.container}>
          <Searchbar searchItem={this.searchItem}/>
		  <View style={{borderBottomColor:"lightgray", borderBottomWidth:1, paddingBottom:16}}>
		  	<Title style={{paddingTop:16}}>Recently Searched Items</Title>
		  </View>

          {/* RECENTLY SEARCHED */}
          <ScrollView style={styles.container}
            contentContainerStyle={styles.contentContainer}>
            <View style={styles.MainContainer}>
              <FlatList
				data={recentlySearchedItems.sort((a, b) => {return b.timestamp - a.timestamp})} // Sorting in reverse chronological order
				ListEmptyComponent={this.showEmptyComponent}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({item}) => {
					return (
						<SwipeView
							disableSwipeToRight = {true}
							// swipeToOpenPercent = {50}
							renderVisibleContent = {() => 
								<ListItem title={item.searchedText} onPress={() => searchItem(item.searchedText)} bottomDivider chevron/>         
							}

							renderRightView={() => (
								<View style={styles.swipeRow}>
									<Text style={styles.colorStyle}>REMOVE</Text>
								</View>
							)}
							
							onSwipedLeft = {() => this.deleteItemByTimestamp(item.timestamp)}
						/>
					)
				}}
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
		// paddingTop: 30,
	},
	welcomeContainer: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20,
	},
	swipeRow: { // https://github.com/rishabhbhatia/react-native-todo/blob/master/app/containers/styles/CommonStyles.js
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: '#FE4D33'
	},
	colorStyle: {
		color: '#ffffff'
	}
});


// SearchPage TODOs:
// TODO: Implement FlatListItemSeparator and add "ItemSeparatorComponent = {this.FlatListItemSeparator}" to FlatList props
// TODO: Make the UI look good