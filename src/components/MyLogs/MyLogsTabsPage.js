import React, { useState, useEffect } from 'react';
import { Container, Tab, Tabs } from 'native-base';
import { View, ActivityIndicator } from 'react-native';

import DailyLogsPage from './DailyLogsPage';
import WeeklyLogsPage from './WeeklyLogsPage';
import MonthlyLogsPage from './MonthlyLogsPage';
import YearlyLogsPage from './YearlyLogsPage';

import { retrieveFoodLog } from '../../services/LocalStorageService';


export default MyLogsTabsPage = (props) => {
    const { navigation } = props;

    const [isRefreshing, setRefreshing] = useState(false);
	const [isLoading, setLoading] = useState(true);
	const [foodLogsObj, setFoodLogsObj] = useState([]);
	
	// Get the foodLogsObj
	useEffect(() => {
		retrieveFoodLog().then((resp) => {
			console.log("setting: ", resp);
			setFoodLogsObj(resp);
			setLoading(false);
		}).catch((err) => {
			console.log(err);
			setLoading(false);
		});
	}, []);

	// Add a separate useEffect if the logs page is not updating properly

	return (
        <Container>
            {isLoading
				? (<View style={{flex: 1, paddingTop:20}}>
            			<ActivityIndicator />
					</View>)
				: (<Tabs>
                        <Tab heading="Day">
                            <DailyLogsPage logs={foodLogsObj} />
                        </Tab>
                        <Tab heading="Week">
                            <WeeklyLogsPage logs={foodLogsObj} />
                        </Tab>
                        <Tab heading="Month">
                            <MonthlyLogsPage logs={foodLogsObj} />
                        </Tab>
                        <Tab heading="Year">
                            <YearlyLogsPage logs={foodLogsObj} />
                        </Tab>
                    </Tabs>)}
        </Container>
	)
}

MyLogsTabsPage.navigationOptions = {
  title: 'My Logs',
};