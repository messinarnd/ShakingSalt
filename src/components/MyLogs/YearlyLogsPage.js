import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Platform, RefreshControl } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { Title } from 'native-base';

import { retrieveFoodLog } from '../../services/LocalStorageService';

export default YearlyLogsPage = (props) => {
    // The yearly logs page should have a selector at the top like < 2019 >
    // Under that, it should give the totals for that specified year (maybe broken down by month under that?)
    const [isRefreshing, setRefreshing] = useState(false);

    const { foodLogs } = props;

    const date = new Date();

    const [logs, setLogs] = useState(foodLogs);
    const [year, setYear] = useState(date.getFullYear());
    const [yearlyLogs, setYearlyLogs] = useState(logs[year]);

    useEffect(() => {
        setYearlyLogs(logs[year]);
    }, [year]);

    nutritionCardHeader = () => {
        return(
            <View style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
                <Ionicons size={20} name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-dropleft'} onPress={() => {
                    console.log("year left clicked");
                    setYear(year-1);
                }}></Ionicons>
                <Title>{year}</Title>
                <Ionicons size={20} name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-dropright'} onPress={() => {
                    console.log("year right clicked");
                    setYear(year+1);
                }}></Ionicons>
            </View>
        )
    }

    showNutritionTable = () => {
        if (yearlyLogs != null) {
            return (<View>
                <Card title={nutritionCardHeader()}>
                    <View>
                        <ListItem key={2} title={"Calories: "} rightSubtitleStyle={{ color:(yearlyLogs["totals"]["Energy"]["amount"] > (2000*(year%4 == 0 ? 366 : 365)) ? "red" : "green")}} rightSubtitle={(yearlyLogs["totals"]["Energy"]["amount"]).toString()} bottomDivider />
                        <ListItem key={3} title={"Sodium: "} rightSubtitleStyle={{ color:(yearlyLogs["totals"]["Sodium, Na"]["amount"] > (2300*(year%4 == 0 ? 366 : 365)) ? "red" : "green")}} rightSubtitle={(yearlyLogs["totals"]["Sodium, Na"]["amount"]).toString()} bottomDivider />
                        <ListItem key={4} title={"Other Nutrients: "} bottomDivider />
                        {Object.keys(yearlyLogs["totals"]).map((nutrientName, index) => {
                            if (nutrientName != "Energy" || nutrientName != "Sodium, Na") {
                                return (<ListItem key={index} titleStyle={{ color: 'grey', fontSize: 14 }} rightSubtitleStyle={{ color: 'grey', fontSize: 14 }} title={nutrientName} rightSubtitle={(yearlyLogs["totals"][nutrientName]["amount"]).toFixed(2) + yearlyLogs["totals"][nutrientName]["unit"]} />)
                            }
                        })}
                    </View>
                </Card>
                </View>);
        } else {
            return (
                <View>
                    <Card title={nutritionCardHeader()}>
                        <View style={{minHeight:35, flex:1, flexDirection:"row", justifyContent:"center", alignContent:"center", alignItems:"flex-end"}}>
                            <Text style={{fontSize:16}}>No logged items for this year!</Text>
                        </View>
                    </Card>
                </View>
            )
        }
    }

    onRefresh = () => {
        setRefreshing(true);
        retrieveFoodLog().then((resp) => {
            setLogs(resp);
            setYearlyLogs(logs[year]);
			setRefreshing(false);
		}).catch((err) => {
			console.log(err);
			setRefreshing(false);
		});
    }

    return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}></RefreshControl>}>
                {showNutritionTable()}
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
// TODO: add a dropdown to switch the year (like calendar view)
// TODO: color the sodium by if they went over the yearly limit (2300*number of days in year (365/366))
// TODO: show a detailed view where they can see the year broken down by month (just calories and sodium)