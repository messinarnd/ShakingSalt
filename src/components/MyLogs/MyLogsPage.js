import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';


export default function MyLogsPage() {
  return (
    <View style={styles.container}>
        <ScrollView style={styles.container}
        contentContainerStyle={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
                <Text>Hello, Logs!</Text>
            </View>
        </ScrollView>
    </View>
  );
}

MyLogsPage.navigationOptions = {
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
