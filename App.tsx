import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import './src/styles/global.css';

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.appContainer}>
        <AppNavigator />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appContainer: {
    flex: 1,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    padding: 20,
    width: '100%',
  },
});

export default App;