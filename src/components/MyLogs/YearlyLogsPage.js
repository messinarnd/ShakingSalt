import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

export default YearlyLogsPage = (props) => {
    const { logs } = props;

    const [year, setYear] = useState((new Date()).getFullYear());
    const [yearlyLogs, setYearlyLogs] = useState(logs[year]);
    const months = ["buffer", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // For when there's no logged items
    showEmptyComponent = () => {
        console.log("logsss: ", yearlyLogs)
        return (
            <View>
                <Text style={styles.emptyMessageStyle}>No logged items for this year. Log Something!</Text>
            </View>
        )
    }

    return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <FlatList
                    data = {Object.keys(yearlyLogs)}
                    ListEmptyComponent={this.showEmptyComponent}
                    renderItem={({month}) => {
                        if (month != "totals") {
                            let monthIndex = parseInt(month);
                            <ListItem title={months[monthIndex]} />
                        }
                    }}
                    ListHeaderComponent={<ListItem bottomDivider stlye={styles.sectionHeader} title={year}></ListItem>}
                    keyExtractor={(item, index) => index.toString()}
                />
			</ScrollView>
		</View>
	)
}

YearlyLogsPage.navigationOptions = {
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
    }
});

// Yearly Logs TODOs:
// TODO: add a dropdown to switch the years and updated the yearlyLogs accordingly