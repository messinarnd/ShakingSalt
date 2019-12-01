import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Platform, RefreshControl } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { Title } from 'native-base';

import { retrieveFoodLog } from '../../services/LocalStorageService';

export default MonthlyLogsPage = (props) => {
    const [isRefreshing, setRefreshing] = useState(false);

    const { foodLogs } = props;

    const date = new Date();

    const [logs, setLogs] = useState(foodLogs);
    const [year, setYear] = useState(date.getFullYear());
    const [month, setMonth] = useState(twoDigitFormat(date.getMonth()+1));
    const [monthlyLogs, setMonthlyLogs] = useState(logs[year] != null ? logs[year][month] : null);
    const months = ["buffer", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysInMonths = [0, 31, year%4 == 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    twoDigitFormat = (num) => {
        return (num<10 ? '0'+num : num);
    }

    useEffect(() => {
        setMonthlyLogs(logs[year] != null ? logs[year][month] : null);
    }, [month]);

    nutritionCardHeader = () => {
        return(
            <View style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
                <Ionicons size={20} name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-dropleft'} onPress={() => {
                    console.log("month left clicked");
                    if (month-1 == 0) {
                        setYear(year-1);
                        setMonth(12);
                    } else {
                        setMonth(month-1);
                    }
                }}></Ionicons>
                <Title>{months[month] + ", " + year}</Title>
                <Ionicons size={20} name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-dropright'} onPress={() => {
                    console.log("month right clicked");
                    if (month+1 == 13) {
                        setYear(year+1);
                        setMonth(1);
                    } else {
                        setMonth(month + 1);
                    }
                }}></Ionicons>
            </View>
        )
    }

    showNutritionTable = () => {
        if (monthlyLogs != null) {
            return (
                <View>
                    <Card title={nutritionCardHeader()}>
                        <View>
                            <ListItem key={2} title={"Calories: "} rightSubtitleStyle={{ color:(monthlyLogs["totals"]["Energy"]["amount"] > (2000*daysInMonths[month]) ? "red" : "green")}} rightSubtitle={(monthlyLogs["totals"]["Energy"]["amount"]).toString()} bottomDivider />
                            <ListItem key={3} title={"Sodium: "} rightSubtitleStyle={{ color:(monthlyLogs["totals"]["Sodium, Na"]["amount"] > (2300*daysInMonths[month]) ? "red" : "green")}} rightSubtitle={(monthlyLogs["totals"]["Sodium, Na"]["amount"]).toString()} bottomDivider />
                            <ListItem key={4} title={"Other Nutrients: "} bottomDivider />
                            {Object.keys(monthlyLogs["totals"]).map((nutrientName, index) => {
                                if (nutrientName != "Energy" || nutrientName != "Sodium, Na") {
                                    return (<ListItem key={index} titleStyle={{ color: 'grey', fontSize: 14 }} rightSubtitleStyle={{ color: 'grey', fontSize: 14 }} title={nutrientName} rightSubtitle={(monthlyLogs["totals"][nutrientName]["amount"]).toFixed(2) + monthlyLogs["totals"][nutrientName]["unit"]} />)
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
                            <Text style={{fontSize:16}}>No logged items for this month!</Text>
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
            setMonthlyLogs(resp[year] != null ? resp[year][month] : null);
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

MonthlyLogsPage.navigationOptions = {
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

// MonthlyLogs TODOs:
// TODO: add a dropdown to switch the month (like calendar view)
// TODO: color the sodium by if they went over the monthly limit (2300*number of days in month)
// TODO: show a detailed view where they can see the month broken down by week (just calories and sodium)