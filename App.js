// Final Project
// CIS 657(01) (Spring/Summer 2024)
// Zachary Stout
// Completed: ???

import React from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddScreen from './screens/AddScreen';
import SettingsScreen from './screens/SettingsScreen';
import PantryListScreen from './screens/PantryListScreen';


export default function App() {
  const Stack = createNativeStackNavigator();


  // common screens options found at:
  // https://reactnavigation.org/docs/headers/#sharing-common-options-across-screens
  // found hint toward understanding the theme for the background at:
  // https://www.reddit.com/r/reactnative/comments/ifp01k/questions_background_colour_and_react_navigation/
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeAreaStyle}>
        <NavigationContainer theme={{colors: {background: '#FFFECF'}}}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#8EC861', // around header words
              },
              headerTintColor: '#8D0CFF', // word coloring
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              // background: '#8EC861', // (attempted, but does nothing)
            }}
          >
            <Stack.Screen
              name='Co-Pantry'
              component={PantryListScreen}
            />
            <Stack.Screen
              name='Add Item'
              component={AddScreen}
            />
            <Stack.Screen
              name='Settings'
              component={SettingsScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  safeAreaStyle: {
    backgroundColor: '#9C51B6',
    // margin: 20,
    paddingTop: 25,
    flex: 1,
  },
});
