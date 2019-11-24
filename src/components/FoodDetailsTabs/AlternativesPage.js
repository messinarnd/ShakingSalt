import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList } from 'react-native';
import AlternativesListItem from './AlternativesListItem';
import { ListItem } from 'react-native-elements';

export default AlternativesPage = (props) => {
	// global.filtered has our array of search results except the currently clicked item
	const { foodDetails, sodiumLevel, navigation } = props;

	const [alternativesList, setAlternativesList] = useState((global.filtered).filter((item) => item["sodiumLevel"] < sodiumLevel));

	// For when there's no search results (used by FlatList component)
	showEmptyComponent = () => {
		return (
			<View>
				<Text style={styles.emptyMessageStyle}>We were unable to find any lower sodium alternatives matching your requested search!</Text>
			</View>
		)
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <FlatList
                    data = {alternativesList}
                    ListEmptyComponent={this.showEmptyComponent}
                    renderItem={({item}) =>
                        <AlternativesListItem navigation={navigation} item={item}></AlternativesListItem>
                    }
                    ListHeaderComponent={<ListItem bottomDivider stlye={styles.sectionHeader} title="Lower Sodium Alternatives          Sodium per 100g"></ListItem>}
                    keyExtractor={(item, index) => index.toString()}
                    stickyHeaderIndices={[0]}
                />
            </ScrollView>
        </View>
    );
}

AlternativesPage.navigationOptions = {
  title: 'Alternatives',
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

// Alternatives Page TODOs:
// TDOD: get more alternatives if less than 50 are shown!! (currently the alternatives only look at the original 50)