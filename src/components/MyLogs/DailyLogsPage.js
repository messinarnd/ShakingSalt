import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Platform, RefreshControl } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { Title } from 'native-base';

import { retrieveFoodLog } from '../../services/LocalStorageService';

export default DailyLogsPage = (props) => {
    const [isRefreshing, setRefreshing] = useState(false);
	
    const { foodLogs } = props;
    
    const date = new Date();

    const [logs, setLogs] = useState(foodLogs);
    const [year, setYear] = useState(date.getFullYear());
    const [month, setMonth] = useState(twoDigitFormat(date.getMonth()+1));
    const [day, setDay] = useState(twoDigitFormat(date.getDate()));
    const [dayOfWeek, setDayOfWeek] = useState(date.getDay());
    const [dailyLogs, setDailyLogs] = useState(((logs[year] != null) && (logs[year][month] != null)) ? logs[year][month][day] : null);

    const months = ["buffer", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysInMonths = [0, 31, year%4 == 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    twoDigitFormat = (num) => {
        return (num<10 ? '0'+num : num);
    }

    useEffect(() => {
        setDailyLogs(((logs[year] != null) && (logs[year][month] != null)) ? logs[year][month][day] : null);
    }, [day]);

    nutritionCardHeader = () => {
        return(
            <View style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
                <Ionicons size={20} name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-dropleft'} onPress={() => {
                    console.log("day left clicked");
                    if (parseInt(day)-1 == 0) {
                        if (parseInt(month)-1 == 0) {
                            setMonth(twoDigitFormat(12));
                            setYear(year-1);
                            setDay(daysInMonths[12]);
                        } else {
                            setMonth(twoDigitFormat(parseInt(month)-1));
                            setDay(daysInMonths[parseInt(month)-1]);
                        }
                    } else {
                        setDay(twoDigitFormat(parseInt(day)-1));
                    }
                    setDayOfWeek(((dayOfWeek-1)+7)%7);
                }}></Ionicons>
                <Title>{daysOfWeek[dayOfWeek] + " " + months[parseInt(month)] + " " + parseInt(day) + ", " + year}</Title>
                <Ionicons size={20} name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-dropright'} onPress={() => {
                    console.log("day right clicked");
                    console.log("day+1: ", day+1);
                    if (parseInt(day)+1 > daysInMonths[parseInt(month)]) {
                        if (parseInt(month) + 1 == 13) {
                            setMonth(twoDigitFormat(1));
                            setYear(year+1);
                            setDay(twoDigitFormat(1));
                        } else {
                            setMonth(twoDigitFormat(parseInt(month)+1));
                            setDay(twoDigitFormat(1));
                        }
                    } else {
                        setDay(twoDigitFormat(parseInt(day)+1));
                    }
                    setDayOfWeek(((dayOfWeek+1)+7)%7);
                }}></Ionicons>
            </View>
        )
    }

    showNutritionTable = () => {
        if (dailyLogs != null) {
            return (<View>
                <Card title={nutritionCardHeader()}>
                    <View>
                        <ListItem key={2} title={"Calories: "} rightSubtitleStyle={{ color:(dailyLogs["totals"]["Energy"]["amount"] > 2000 ? "red" : "green")}} rightSubtitle={(dailyLogs["totals"]["Energy"]["amount"]).toString()} bottomDivider />
                        <ListItem key={3} title={"Sodium: "} rightSubtitleStyle={{ color:(dailyLogs["totals"]["Sodium, Na"]["amount"] > 2300 ? "red" : "green")}} rightSubtitle={(dailyLogs["totals"]["Sodium, Na"]["amount"]).toString()} bottomDivider />
                        <ListItem key={4} title={"Other Nutrients: "} bottomDivider />
                        {Object.keys(dailyLogs["totals"]).map((nutrientName, index) => {
                            if (nutrientName != "Energy" || nutrientName != "Sodium, Na") {
                                return (<ListItem key={index} titleStyle={{ color: 'grey', fontSize: 14 }} rightSubtitleStyle={{ color: 'grey', fontSize: 14 }} title={nutrientName} rightSubtitle={(dailyLogs["totals"][nutrientName]["amount"]).toFixed(2) + dailyLogs["totals"][nutrientName]["unit"]} />)
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
                            <Text style={{fontSize:16}}>No logged items for this day!</Text>
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
            setDailyLogs(((resp[year] != null) && (resp[year][month] != null)) ? resp[year][month][day] : null);
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

DailyLogsPage.navigationOptions = {
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

// DailyLogs TODOs:
// TODO: add a dropdown to switch the day (like calendar view)
// TODO: color the sodium by if they went over the daily limit
// TODO: show a detailed view where they can see individual logs rather than just and overview