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
  inithw4DB,
  storeHistoryItem,
  setupHistoryListener,
} from '../helpers/fb-CoPantry';
import { AntDesign } from '@expo/vector-icons';
 

const AddScreen = ({ route, navigation }) => {
  
  const prodDetails = {
    prodTitle: '',
    prodExpirationDate: '',
    prodDateToBin: '', // if left empty, autoset as expirationDate?
    prodIsExpired: false,
    prodThumbnail: '',
    prodPrice: '',
    prodBarcode: '',
  }

  
  const [state, setState] = useState(prodDetails);

  const updateStateObject = (vals) => {
    // console.log('---- In updateStateObject ', vals);
    setState({
      ...state,
      ...vals,
    });
  };


  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.navTouchStyle}
          onPress={() => {
            navigation.navigate(
              'Co-Pantry',
              {historyState}
            );
            console.log('headerLeft (To Co-Pantry) clicked!');
            Keyboard.dismiss();
          }}
        >
          <AntDesign name="left" size={24} color="black" />
          <Text style={styles.navTextStyle}> Cancel </Text>
        </TouchableOpacity>
      )
    });

    if (route.params?.photo) {
      updateStateObject({prodThumbnail: (route.params)})
    }

  },
  [
    route.params?.photo,
  ]);



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
        onChangeText={(val) => updateStateObject({ prodPrice: val })}
      />

      <Text> Picture: </Text>

      {tryRenderImage(state.prodThumbnail)}

    

      <Padder>
        <Button
          style={styles.buttons}
          title='Add a Picture'
          onPress={() => {
            Keyboard.dismiss();
            navigation.navigate(
              'Camera',
              state
            );
            console.log('sending params to Camera: ', state);
          }}
        />
      </Padder>


      <Padder>
        <Button
          style={styles.buttons}
          title='Add Item'
          onPress={() => {
            // create timestamp and store the points to persistent Firebase DB memory
            if (formValid(state) === true) {
              let timeOfAdd = new Date().toString();
              storeHistoryItem({state, timeOfAdd});
              navigation.navigate(
                'Co-Pantry',
                // items to send back
              );
              Keyboard.dismiss();
            };
          }}
        />
      </Padder>

      {/* <Padder>
        <Button
          style={styles.buttons}
          title='Clear'
          onPress={() => {
            Keyboard.dismiss();
            updateStateObject({
              prodTitle: '',
              prodExpirationDate: '',
              prodDateToBin: '',
              prodIsExpired: false,
              prodThumbnail: '',
              prodPrice: '',
              prodBarcode: '',
            });
          }}
        />
      </Padder> */}


      {/* <Padder>
        <Button
          style={styles.buttons}
          title='log params from Camera'
          onPress={() => {
            console.log(route.params)
          }}
        />
      </Padder> */}


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
    maxHeight: 150,
  },
  imagePreview: {
    alignSelf: 'stretch',

    height: '100%',
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

export default AddScreen;
