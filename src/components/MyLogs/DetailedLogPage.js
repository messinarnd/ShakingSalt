import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, ListItem } from 'react-native-elements';

export default DetailedLogPage = (props) => {
    const { navigation } = props;
    const { params } = navigation.state;
    const logsToDisplay = params.logsToDisplay;

    // console.log("here: ", logsToDisplay);

    return (
        <View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {Object.keys(logsToDisplay).map((logTimestamp, index) => {
                    if (logTimestamp != "totals") {
                        console.log("logToDisplay: ", logsToDisplay);
                        console.log("logTimestamp: ", logTimestamp);
                        let log = logsToDisplay[logTimestamp];
                        console.log("logg: ", log);
                        return (
                            // Put the food infor as title
                            <Card key={index} title={log.description + " - " + log.brandOwner}>
                                <View>
                                    <ListItem key={2} title={"Calories"} rightSubtitleStyle={{ color:(log["nutrients"]["Energy"]["amount"] > (2000*0.2) ? "red" : (log["nutrients"]["Energy"]["amount"] < (2000*0.05) ? 'green' : 'orange'))}} rightSubtitle={(log["nutrients"]["Energy"]["amount"]).toString()} bottomDivider />
                                    <ListItem key={3} title={"Sodium"} rightSubtitleStyle={{ color:(log["nutrients"]["Sodium, Na"]["amount"] > (2300*0.2) ? "red" : (log["nutrients"]["Sodium, Na"]["amount"] < (2300*0.05) ? 'green' : 'orange'))}} rightSubtitle={(log["nutrients"]["Sodium, Na"]["amount"]).toString()} bottomDivider />
                                    <ListItem key={4} title={"Amount Eaten"} rightSubtitleStyle={{color:"dimgray"}} rightSubtitle={log["servingAmount"].toString() + log["servingSize"]} bottomDivider />
                                    <ListItem key={5} title={"Logged at"} rightSubtitleStyle={{color:"dimgray"}} rightSubtitle={log["formattedTime"]} bottomDivider />
                                    <AccordionItem key={6} title={"Other Nutrients"} data={log["nutrients"]} />
                                </View>
                            </Card>
                        )
                    }
                })}
			</ScrollView>
		</View>
    )
}

DetailedLogPage.navigationOptions = {
    title:'DetailedLogPage'
}

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

// DetailedLogPage TODOs:
// TODO: add pull down to refresh (refresh control) so current daily logs can be fetched if someone adds a new one