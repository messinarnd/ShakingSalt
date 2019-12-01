import React, { useState, useEffect } from 'react';
import { Container, Tab, Tabs } from 'native-base';
import { View, ActivityIndicator } from 'react-native';

import DailyLogsPage from './DailyLogsPage';
import MonthlyLogsPage from './MonthlyLogsPage';
import YearlyLogsPage from './YearlyLogsPage';

import { retrieveFoodLog } from '../../services/LocalStorageService';


export default MyLogsTabsPage = (props) => {
	const [isLoading, setLoading] = useState(true);
	const [foodLogsObj, setFoodLogsObj] = useState([]);
	
	// Get the foodLogsObj
	useEffect(() => {
		retrieveFoodLog().then((resp) => {
			setFoodLogsObj(resp);
			setLoading(false);
		}).catch((err) => {
			console.log(err);
			setLoading(false);
		});
	}, []);

	return (
        <Container>
            {isLoading
				? (<View style={{flex: 1, paddingTop:20}}>
            			<ActivityIndicator />
					</View>)
				: (<Tabs>
                        <Tab heading="Day">
                            <DailyLogsPage foodLogs={foodLogsObj} />
                        </Tab>
                        <Tab heading="Month">
                            <MonthlyLogsPage foodLogs={foodLogsObj} />
                        </Tab>
                        <Tab heading="Year">
                            <YearlyLogsPage foodLogs={foodLogsObj} />
                        </Tab>
                    </Tabs>)}
        </Container>
	)
}

MyLogsTabsPage.navigationOptions = {
  title: 'My Logs',
};

// MyLogs TODOs:
// TODO: create a weekly logs page tab (this is harder since you have to get the previous 7 daily logs) - probably not in MVP scope
// Make the refresh on one of the logs tabs refresh all other tabs as well