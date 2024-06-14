import { Button, Input, Image } from '@rneui/themed';
import { 
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Padder from '../components/Padder';
import {
  updateHistoryItem,
} from '../helpers/fb-CoPantry';
import { AntDesign } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
 

const UpdateScreen = ({ route, navigation }) => {
  // NOTE:
    // route.params retains db ID of item
    // route.params.state retains ONLY data, no ID

  let item = route.params; // preserve original item

  // item key, extracted to avoid deletion in update...
    // ... and to be explicitly listed
    const [itemKey, setItemKey] = useState(route.params.id);

  // "state" tracks values on current screen
    // value changes are only made to "state"
  const [state, setState] = useState(route.params.state);

  
  const updateStateObject = (vals) => {
    // console.log('---- In updateStateObject ', vals);
    setState({
      ...state,
      ...vals,
    });
  };

  const [openA, setOpenA] = useState(false);
  const [valueA, setValueA] = useState(route.params.state.prodIsExpired);
  const [itemsA, setItemsA] = useState([
    {label: 'Yes', value: true},
    {label: 'No', value: false}
  ]);

  

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.navTouchStyle}
          onPress={() => {
            navigation.navigate(
              'View Item',
              {item}, // send unchanged original item
            );
            // console.log('headerLeft (back to View Item) clicked!');
            Keyboard.dismiss();
          }}
        >
          <AntDesign name="left" size={24} color="black" />
          <Text style={styles.navTextStyle}> Cancel </Text>
        </TouchableOpacity>
      )
    });
      
      console.log('----->>> Update params from ViewItemScreen detected. Params passed: \n',
        route.params
      );
  
    
  },
  []
  );



  function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }

  function validateNonEmpty(value) {
    return !(value) ? 'Required field' : '';
  }

  function validateIsNum(value) {
    return isNaN(value) ? 'Must be a number' : '';
  }

  function formValid(vals) {
    // console.log(vals.prodTitle);
    if (
      (!vals.prodTitle) ||  // isNaN is true if NaN is returned after...
      (!vals.prodExpirationDate) ||     // ... being converted to a number
      (!vals.prodDateToBin) ||
      isNaN(vals.prodPrice)
    ) {
      return false;
    } else if (
      vals.prodTitle === '' ||
      vals.prodExpirationDate === '' ||
      vals.prodDateToBin === '' ||
      vals.prodPrice === ''
    ) {
      return false;
    } else {
      return true;
    }
  }


  let tryRenderImage = (image) => {
    try {
      return (
        <View style={styles.imagePreviewContainer}>
          <Image
            style={styles.imagePreview}
            resizeMode='contain'
            source={{uri:
              `${image.uriKeyBase},
              ${image.photo.base64}`
            }}

          />
        </View>
      )
    } catch (e) {
      return (
        <Text style={styles.noImageStyle}>
          (No Picture Provided)
        </Text>
      )
    }
  }

  
  return (
    <Padder>
      
      <Text> Product Name: </Text>
      <Input
        placeholder='Enter product name'
        value={state.prodTitle.toString()}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validateNonEmpty(state.prodTitle)}
        onChangeText={(val) => updateStateObject({ prodTitle: val })}
      />

      <Text> Expiration Date: </Text>
      <Input
        placeholder='Enter expiration date'
        value={state.prodExpirationDate.toString()}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validateNonEmpty(state.prodExpirationDate)}
        onChangeText={(val) => updateStateObject({ prodExpirationDate: val })}
      />

      <Text> Has This Expired? </Text>
      <DropDownPicker
          style={{marginBottom: 15}}
          open={openA}
          // onOpen={onOpenA}
          // // playing with options:
          // theme="DARK"
          // mode="SIMPLE"
          // dropDownDirection="AUTO"
          // bottomOffset={100}
          listMode="SCROLLVIEW"
          value={valueA}
          items={itemsA}
          setOpen={setOpenA}
          setValue={setValueA}
          setItems={setItemsA}
          // zIndex={1000} // no need since only one
          onChangeValue={(value) => {
            updateStateObject({ prodIsExpired: value })
            console.log('1 and 2 dropdown value changed to:', value);
          }}
          placeholder="Select an Option"
        />

      <Text> Date to Throw Away: </Text>
      <Input
        placeholder='Enter the date to throw it away'
        value={state.prodDateToBin.toString()}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validateNonEmpty(state.prodDateToBin)}
        onChangeText={(val) => updateStateObject({ prodDateToBin: val })}
      />

      <Text> Price: </Text>
      <Input
        placeholder='Enter product price'
        value={state.prodPrice.toString()}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validateIsNum(state.prodPrice)}
        onChangeText={(val) => {
          updateStateObject({prodPrice: val})
        }}
      />

      <Text> Picture: </Text>
      {tryRenderImage(item.state.prodThumbnail)}



      <Padder>
        <Button
          style={styles.buttons}
          title='Save'
          onPress={() => {
            if (formValid(state) === true) {
              console.log('UPDATE BUTTON PRESSED');
              updateHistoryItem(state, itemKey);
              navigation.navigate(
                'View Item',
                // reconstruct an item to send back (avoid extra DB call)
                // formatted to match incoming item from route.params
                {item: 
                  {id: itemKey, state: {...state}, timeOfAdd: route.params.timeOfAdd}
                },
              );

              Keyboard.dismiss();
            };
          }}
        />
      </Padder>


      {/*
      <Padder>
        <Button
          style={styles.buttons}
          title='LOG params'
          onPress={() => {
            console.log('-------- FROM UPDATE --------');
            console.log('params to Update: ', route.params);
            console.log('---------------------------------');
          }}
        />
      </Padder>
      */}

  </Padder>  
  );
};

const styles = StyleSheet.create({
  buttons: {
    margin: 10,
  },
  input: {
    color: 'red',
  },
  navTouchStyle: {
    flexDirection: 'row',
    justifyContet: 'flex-end',
    alignItems: 'center',
  },
  navTextStyle: {
    fontSize: 15,
  },
  imagePreviewContainer: {
    // alignContent: 'center',
    // justifyContent: 'center',
    maxHeight: 150,
    // borderColor: 'red',
    // borderWidth: 2,
  },
  imagePreview: {
    alignSelf: 'stretch',
    // // justifyContent: 'center',
    // // alignItems: 'center',
    // // flex: 1,
    height: '100%',
    // maxHeight: 20,
    width: '100%',
    // borderWidth: 2,
  },
  noImageStyle: {
    height: 100,
    width: '95%',
    fontSize: 15,
    alignSelf: 'center',
    fontStyle: 'italic',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 2,
  },
});

export default UpdateScreen;
