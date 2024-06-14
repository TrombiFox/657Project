import { Button, Input } from '@rneui/themed';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useEffect, useCallback } from 'react';
import Padder from '../components/Padder';
import DropDownPicker from 'react-native-dropdown-picker';


const SettingsScreen = ({ route, navigation }) => {

  const [openA, setOpenA] = useState(false);
  const [valueA, setValueA] = useState();
  const [itemsA, setItemsA] = useState([
    {label: 'Option 1', value: 'Option1'},
    {label: 'Option 2', value: 'Option2'}
  ]);

  const [openB, setOpenB] = useState(false);
  const [valueB, setValueB] = useState();
  const [itemsB, setItemsB] = useState([
    {label: 'Option 3', value: 'Option3'},
    {label: 'Option 4', value: 'Option4'}
  ]);

  const onOpenA = useCallback(() => {
    setOpenB(false);
  }, []);

  const onOpenB = useCallback(() => {
    setopenA(false);
  }, []);



  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // console.log('currentUnitTypes.distanceUnits after Save pressed:', currentUnitTypes.distanceUnits);
            // console.log('currentUnitTypes.bearingUnits after Save pressed:', currentUnitTypes.bearingUnits);
            console.log('valueA after Save clicked:', valueA);
            console.log('valueB after Save clicked:', valueB);
            navigation.navigate(
              'Co-Pantry',
              {
                valueA,
                valueB,
              }
            );
            console.log('headerRight (Save) clicked!');
          }}
        >
          <Text> Save </Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Co-Pantry');
            console.log('headerLeft (Cancel) clicked!');
          }}
        >
          <Text> Cancel </Text>
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
    })
  },
  [valueA, valueB]);


  return (
    <View style={styles.screen}>
      <Padder>
        <Text> Options 1 and 2 </Text>
        <DropDownPicker
          open={openA}
          onOpen={onOpenA}
          // // playing with options:
          // theme="DARK"
          // mode="SIMPLE"
          // dropDownDirection="AUTO"
          // bottomOffset={100}
          listMode="SCROLLVIEW" // could set to MODAL as a temp fix
          value={valueA}
          items={itemsA}
          setOpen={setOpenA}
          setValue={setValueA}
          setItems={setItemsA}
          zIndex={3000} //set 
          onChangeValue={(value) => {
            console.log('1 and 2 dropdown value changed to:', value);
          }}
          // // more playing with another option:
          // disabled={true}
          // disabledStyle={{opacity: 0.1}}
          placeholder="Select an Option"
        />
      </Padder>
      <Padder>
        <Text> Options 3 and 4 </Text>
        <DropDownPicker
          open={openB}
          onOpen={onOpenB}
          value={valueB}
          items={itemsB}
          setOpen={setOpenB}
          setValue={setValueB}
          setItems={setItemsB}
          zIndex={2000}
          onChangeValue={(value) => {
            console.log('3 and 4 dropdown value changed to:', value)
          }}
          placeholder="Select an Option"
        />
      </Padder>




      {/*
      <Padder>
        <Button
          style={styles.buttons}
          title='LOG'
          onPress={() => {
            console.log('-------- FROM SETTINGS --------');
            console.log('route.params in Settings (from HOME):', route.params);
            // console.log('currentUnitTypes: ', currentUnitTypes);
            console.log('valueA from Settings:', valueA);
            console.log('valueB from Settings:', valueB);
            console.log('-------------------------------');
          }}
        />
      </Padder>
      */}



    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    margin: 10,
  },
  input: {
    color: 'red',
  },
  screen: {
    flex: 1,
    padding: 4,
    paddingTop: 10,
  },  
});

export default SettingsScreen;
