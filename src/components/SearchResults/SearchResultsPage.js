import React from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import SearchListItem from './SearchListItem';

export default SearchResultsPage = (props) => {
    // Get the foodItems array that was passed from SearchResultsPage
    const { navigation } = props
    const { params } = navigation.state;
    const foodItems = params.foodItems;

    // currently used for passing the food item search
    global.test = foodItems;
    global.filtered = foodItems;
    global.foodItemsWithNutrients = [];

    // For when there's no search results (used by FlatList component)
	showEmptyComponent = () => {
		return (
			<View>
				<Text style={styles.emptyMessageStyle}>Sorry, no items matched your search.</Text>
			</View>
		)
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <FlatList
                    data = {foodItems}
                    ListEmptyComponent={this.showEmptyComponent}
                    renderItem={({item}) =>
                        <SearchListItem navigation={navigation} item={item}></SearchListItem>
                    }
                    ListHeaderComponent={<ListItem bottomDivider stlye={styles.sectionHeader} title="Search Results                                Sodium per 100g"></ListItem>}
                    keyExtractor={(item, index) => index.toString()}
                    stickyHeaderIndices={[0]}
                />
            </ScrollView>
        </View>
    );
}

SearchResultsPage.navigationOptions = {
    title: 'Search Results',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingTop: 30,
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
      },
      item: {
        padding: 10,
        fontSize: 18,
        height: 44,
      },
});

// Search Results Page TODOs:
// TODO: Style the 'Search Results' section header
//      - make it stand out from other list items (don't think styles is actually doing anything)
//      - make it sticky (stickyHeaderIndices in flatList not working)
//      - Add the "Sodium per 100g" as a right subtitle or something (width of screen is different on every phone)