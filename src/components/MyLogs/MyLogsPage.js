import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ListView,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { retrieveFoodLog } from '../../services/LocalStorageService';
import { TouchableOpacity } from 'react-native-gesture-handler';

const LOG_STORAGE_KEY = 'LOG_ITEMS_STORAGE' // Don't put it in Constants cause it doesn't get initialized before call to log DB cause react suX


// The logs page should have tabs at the top like __DAY__|__WEEK__|__MONTH__|__YEAR__
// Each tab should show the logs for the current {insert time period here}
// Just under the tabs, there should be a bar like:    < November 23, 2019 > or < Nov. 17-23, 2019 > or < November, 2019 > or < 2019 >
// If you click on the left or right arrows, it takes you to the previous/next d/w/m/y (title should update appropiately)
// If you click on the date, a dropdown list will appear and you can scroll to find the d/w/m/y you are looking for
// If there are no logs for that time period, display "No food has been logged for the selected time period. Change the date range or try logging something!"
// The year view should have monthly overviews
// The month view should have weekly overviews
// The week view should have daily overviews - scrap the week view because it's too complicated getting calendar week (Su - Sa)
// The day view should show all logged food items (maybe broken down by meal but definitely by time)
// Maybe if you click a food item from the daily view, it could either open details about that log or the foodDetailsPage so you can log it again

export default MyLogsPage = (props) => {
	const [isRefreshing, setRefreshing] = useState(false);
	const [isLoading, setLoading] = useState(true);
	const [foodLogsObj, setFoodLogsObj] = useState([]);
	
	// Get the foodLogsObj
	useEffect(() => {
		retrieveFoodLog().then((resp) => {
			console.log("setting: ", resp);
			setFoodLogsObj(resp);
			setLoading(false);
		}).catch((err) => {
			console.log(err);
			setLoading(false);
		});
	}, []);

	// Add a separate useEffect if the logs page is not updating properly

	FlatListItemSeparator = () => {
		return (
			<View
				style={{
					height: 2,
					width: "100%",
					backgroundColor: "#000",
				}}
			/>
		);
	}

	// For when there's no logged items
	showEmptyComponent = () => {
		return (
			<View>
				<Text style={styles.emptyMessageStyle}>No Logged Items. Eat Something!</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				{isLoading
				? (<View style={{flex: 1, paddingTop:20}}>
            			<ActivityIndicator />
					</View>)
				: (<View style={styles.MainContainer}>
						{/* ListView is deprecated don't use it fam */}
						{Object.keys(foodLogsObj).map((year, index) => {
							return (<ListItem key={index} title={year} />)
						})}
					</View>)}
			</ScrollView>
		</View>
	)
}

MyLogsPage.navigationOptions = {
  title: 'My Logs',
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
  },
  emptyMessageStyle: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: '50%', 
  }
});

// MyLogs TODOs:
// TODO: make it look pretty
// TODO: make it so you can add a log at a previous time
// TODO: make sure logs show up in chronological order


// <FlatList
//                 data = {this.state.dataSource}
//                 ItemSeparatorComponent = {this.FlatListItemSeparator}
//                 ListEmptyComponent={this.showEmptyComponent}
//                 refreshControl = {
//                   <RefreshControl
//                     refreshing = {this.state.isRefreshing}
//                     onRefresh = {this.onRefresh.bind(this)}
//                   />
//                 }
//                 renderItem={({item}) =>
//                   <View>
// 					  <ListItem title={item.logTimeStamp ? item.logTimeStamp : item.timestamp} />
//                     {/* <ListItem title={"Timestamp: "} rightSubtitle={item.logTimeStamp} />
//                     <ListItem title={"fdcId: "} rightSubtitle={item.logFdcId} />
//                     <ListItem title={"Food Category: "} rightSubtitle={item.logBrandedFoodCategory} />
//                     <ListItem title={"Brand Owner: "} rightSubtitle={item.logBrandOwner} />
//                     <ListItem title={"Serving Size: "} rightSubtitle={item.logServingSize} />
//                     <ListItem title={"Serving Amount: "} rightSubtitle={item.logServingAmount} /> */}
//                   </View>
//                 }    
//                 keyExtractor={(item, index) => index.toString()}
//               />

//   // Pull down to refresh this bad boi
//   onRefresh() {
//     this.setState({ isRefreshing: true });
//     this.retrieveData();
//   }