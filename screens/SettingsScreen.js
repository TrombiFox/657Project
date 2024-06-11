import { Button, Input } from '@rneui/themed';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useEffect, useCallback } from 'react';
import Padder from '../components/Padder';
import DropDownPicker from 'react-native-dropdown-picker';


const SettingsScreen = ({ route, navigation }) => {

  const [openD, setOpenD] = useState(false);
  const [valueD, setValueD] = useState(route.params.distanceUnits);
  const [itemsD, setItemsD] = useState([
    {label: 'Miles', value: 'miles'},
    {label: 'Kilometers', value: 'kilometers'}
  ]);

  const [openB, setOpenB] = useState(false);
  const [valueB, setValueB] = useState(route.params.bearingUnits);
  const [itemsB, setItemsB] = useState([
    {label: 'Mils', value: 'mils'},
    {label: 'Degrees', value: 'degrees'}
  ]);

  const onOpenD = useCallback(() => {
    setOpenB(false);
  }, []);

  const onOpenB = useCallback(() => {
    setOpenD(false);
  }, []);



  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // console.log('currentUnitTypes.distanceUnits after Save pressed:', currentUnitTypes.distanceUnits);
            // console.log('currentUnitTypes.bearingUnits after Save pressed:', currentUnitTypes.bearingUnits);
            console.log('valueD after Save clicked:', valueD);
            console.log('valueB after Save clicked:', valueB);
            navigation.navigate(
              'Geo Calculator',
              {
                valueD,
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
            navigation.navigate('Geo Calculator');
            console.log('headerLeft (Cancel) clicked!');
          }}
        >
          <Text> Cancel </Text>
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
    })
  },
  [valueD, valueB]);


  return (
    <View style={styles.screen}>
      <Padder>
        <Text> Distance Units </Text>
        <DropDownPicker
          open={openD}
          onOpen={onOpenD}
          // // playing with options:
          // theme="DARK"
          // mode="SIMPLE"
          // dropDownDirection="AUTO"
          // bottomOffset={100}
          listMode="SCROLLVIEW" // could set to MODAL as a temp fix
          value={valueD}
          items={itemsD}
          setOpen={setOpenD}
          setValue={setValueD}
          setItems={setItemsD}
          zIndex={3000} //set 
          onChangeValue={(value) => {
            console.log('Distance dropdown value changed to:', value);
          }}
          // // more playing with another option:
          // disabled={true}
          // disabledStyle={{opacity: 0.1}}
          placeholder="insert code for selecting here?"
        />
      </Padder>
      <Padder>
        <Text> Bearing Units </Text>
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
            console.log('Bearing dropdown value changed to:', value)
          }}
        />
      </Padder>




      {/*
      <Padder>
        <Button
          style={styles.buttons}
          title='LOG'
          onPress={() => {
            console.log('-------- FROM SETTINGS --------');
            console.log('route.params in Settings (from Calculator):', route.params);
            // console.log('currentUnitTypes: ', currentUnitTypes);
            console.log('valueD from Settings:', valueD);
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
