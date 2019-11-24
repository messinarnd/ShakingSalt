import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';

export default DailyLogsPage = (props) => {
    const { logs } = props;

    let date = new Date(); // new date object for getting timestamp properties
	let day = twoDigitFormat(date.getDate());
	let month = twoDigitFormat(date.getMonth() + 1);
	let year = date.getFullYear();
	let hours = twoDigitFormat(date.getHours());
	let min = twoDigitFormat(date.getMinutes());
	let sec = twoDigitFormat(date.getSeconds());
	let formattedDateTime = month + '/' + day + '/' + year + ' ' + hours + ':' + min + ':' + sec;

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