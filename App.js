// Final Project
// CIS 657(01) (Spring/Summer 2024)
// Zachary Stout
// Completed: ???

// import * as Analytics from "expo-firebase-analytics";
import analytics from "@react-native-firebase/analytics";
import React, { useRef } from 'react';
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
import UpdateScreen from './screens/UpdateScreen';
import ViewItemScreen from './screens/ViewItemScreen';
import CameraScreen from './screens/CameraScreen';


export default function App() {
  const navigationRef = useRef();
  const routeNameRef = useRef();
  
  const Stack = createNativeStackNavigator();


  // common screens options found at:
  // https://reactnavigation.org/docs/headers/#sharing-common-options-across-screens
  // found hint toward understanding the theme for the background at:
  // https://www.reddit.com/r/reactnative/comments/ifp01k/questions_background_colour_and_react_navigation/
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeAreaStyle}>
        <NavigationContainer
          ref={navigationRef}
          theme={{colors: {background: '#FFFECF'}}}
          onReady={() =>
            (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
          }
          onStateChange={ async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigationRef.current.getCurrentRoute().name;
            console.log(previousRouteName, ' ---> ', currentRouteName);
            if (previousRouteName !== currentRouteName) {
              // await Analytics.logEvent("screen_view", {
                await analytics().logEvent("screen_view", {
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              });
            }
            // Save the current route name for later comparison
            routeNameRef.current = currentRouteName;
          }}
        >
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
            <Stack.Screen
              name='Update Item'
              component={UpdateScreen}
            />
            <Stack.Screen
              name='View Item'
              component={ViewItemScreen}
            />
            <Stack.Screen
              name='Camera'
              component={CameraScreen}
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
