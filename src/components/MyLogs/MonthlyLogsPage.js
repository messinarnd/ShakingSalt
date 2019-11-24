import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';

export default MonthlyLogsPage = (props) => {
    const { logs } = props;

    const [year, setYear] = useState((new Date()).getFullYear());
    const [month, setMonth] = useState(twoDigitFormat((new Date()).getMonth()+1));
    const [monthlyLogs, setMonthlyLogs] = useState(logs[year][month]);
    const months = ["buffer", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    twoDigitFormat = (num) => {
        return (num<10 ? '0'+num : num);
    }

    return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {Object.keys(logs).map((year, index) => {
                    return (<ListItem key={index} title={year} />)
                })}
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