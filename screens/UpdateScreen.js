import { Button, Input, Image } from '@rneui/themed';
import { 
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Padder from '../components/Padder';
import {
  inithw4DB,
  storeHistoryItem,
  updateHistoryItem,
  setupHistoryListener,
} from '../helpers/fb-CoPantry';
import { AntDesign } from '@expo/vector-icons';
 

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

  // const updateItemObject = (vals) => {
  //   // console.log('---- In updateItemObject ', vals);
  //   setItem({
  //     ...item,
  //     ...vals,
  //   });
  // };


  useEffect(() => {
    navigation.setOptions({
      // headerRight: () => (
      //   <TouchableOpacity
      //     onPress={() => {
      //       navigation.navigate(
      //         'Settings',
      //         {distanceUnits: distanceUnits,
      //         bearingUnits: bearingUnits},
      //       );
      //       console.log('headerRight (Settings) clicked!');
      //       Keyboard.dismiss();
      //     }}
      //   >
      //     <FontAwesome name="gears" size={24} color="black"/>
      //   </TouchableOpacity>
      // ),
      // // headerTitleAlign: 'center',  // left here for my own note (how to change style individually)
      // // backgroundColor: '#B9DE8A',
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


  // // render the item WITH error catching
  // let renderHistory = ({ index, item }) => {
  //   try {
  //     return(
  //       <TouchableHighlight style={styles.renderItemStyle}
  //       activeOpacity={0.6}
  //       underlayColor='#8EC861'  
  //       onPress={() => {
  //           // navigation.navigate(
  //           //   'Co-Pantry',
  //           //   { // lat and lon info to pass back
  //           //     p1Lat: item.prodDetails.lat,
  //           //     p1Lon: item.prodDetails.lon,
  //           //     p2Lat: item.prodDetails.lat,
  //           //     p2Lon: item.prodDetails.lon,
  //           //   }
  //           // );
  //           console.log("Item Pressed: ", item);
  //         }}
  //       >
  //         <View>
  //           <Text style={styles.historyTextStyle}> Product: {item.state.prodTitle} </Text>
  //           <Text style={styles.historyTextStyle}> Expiration Date: {item.state.prodExpirationDate} </Text>
  //           <Text style={styles.historyTextStyle}> Expired? {item.state.prodIsExpired.toString()} </Text>
  //           <Text style={styles.timestampStyle}> Added: {item.timeOfCalc} </Text>
  //         </View>
  //       </TouchableHighlight>
  //     );
  //   } catch (e) {
  //     return(
  //       <Text style={styles.renderItemStyle}> (ERROR: Potential Invalid Data Entry) </Text>
  //     );
  //   }
  // };


  // let itemSeparatorRender= () => {
  //   return(
  //     <Text style={{backgroundColor: 'black', height: 1}}> </Text>
  //   )
  // }
  
  return (
    <Padder>
      {/* <Text> Product Name: </Text>
      <Input
        placeholder='Enter product name'
        value={item.state.prodTitle.toString()}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validateNonEmpty(state.prodTitle)}
        onChangeText={(val) => updateStateObject({ prodTitle: val })}
      />
      <Text> Expiration Date: </Text>
      <Input
        placeholder='Enter expiration date'
        value={item.state.prodExpirationDate.toString()}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validateNonEmpty(state.prodExpirationDate)}
        onChangeText={(val) => updateStateObject({ prodExpirationDate: val })}
      />
      <Text> Date to Throw Away: </Text>
      <Input
        placeholder='Enter the date to throw it away'
        value={item.state.prodDateToBin.toString()}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validateNonEmpty(state.prodDateToBin)}
        onChangeText={(val) => updateStateObject({ prodDateToBin: val })}
      /> */}
      <Text> Price: </Text>
      <Input
        placeholder='Enter product price'
        value={state.prodPrice}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validateIsNum(state.prodPrice)}
        onChangeText={(val) => {
          updateStateObject({prodPrice: val})
        }}
      />

      <Text> Picture: </Text>
      <Input
        placeholder='Tap to Take a Picture'
        value={state.prodThumbnail}
        autoCorrect={false}
        errorStyle={styles.input}
        // errorMessage={validateNum(state.lon2)}
        onChangeText={(val) => {
          updateStateObject({ prodThumbnail: val })
        }}
      />

      <Padder>
        <Button
          style={styles.buttons}
          title='Save'
          onPress={() => {
            if (formValid(state) === true) {
              console.log('UPDATE BUTTON PRESSED');
              // let item2 = {...item};
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

      {/* <Padder>
        <Button
          style={styles.buttons}
          title='LOG item'
          onPress={() => {
            console.log('-------- FROM UPDATE --------');
            console.log('item from Update: ', item);
            console.log('---------------------------------');
          }}
        />
      </Padder>

      <Padder>
        <Button
          style={styles.buttons}
          title='LOG item2'
          onPress={() => {
            console.log('-------- FROM UPDATE --------');
            console.log('item2 from Update: ', item2);
            console.log('---------------------------------');
          }}
        />
      </Padder>

      
      <Padder>
        <Button
          style={styles.buttons}
          title='LOG state'
          onPress={() => {
            console.log('-------- FROM UPDATE --------');
            console.log('state from Update: ', state);
            console.log('---------------------------------');
          }}
        />
      </Padder>
     

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
      </Padder> */}


      {/* 
      <Padder>
        <Button
          style={styles.buttons}
          title='LOG'
          onPress={() => {
            console.log('-------- FROM ADD --------');
            console.log('route.params in ADD (from Settings):', route.params);
            console.log('actual distanceUnits in ADD:', distanceUnits);
            console.log('actual bearingUnits in ADD:', bearingUnits);
            console.log('---------------------------------');
          }}
        />
      </Padder>
      */}

      {/* <Padder>
        <Button
          style={styles.buttons}
          title='LOG History params'
          onPress={() => {
            console.log('-------- FROM ADD --------');
            console.log(
              'history params: ', 
              {lat1: route.params.p1Lat,
              lon1: route.params.p1Lon,
              prodDateAdded: route.params.p2Lat,
              prodDateToBin: route.params.p2Lon}
            );
            console.log('---------------------------------');
          }}
        />
      </Padder> */}


      {/* <Padder>
        <Button
          style={styles.buttons}
          title='LOG historyState'
          onPress={() => {
            console.log('-------- FROM ADD --------');
            console.log('historyState: ', historyState);
            console.log('---------------------------------');
          }}
        />
      </Padder> */}

      {/* <Padder>
        <Button
          style={styles.buttons}
          title='LOG state'
          onPress={() => {
            console.log('-------- FROM ADD --------');
            console.log('state: ', state);
            console.log('---------------------------------');
          }}
        />
      </Padder> */}


      {/* CAPITALIZE FIRST LETTER IF POSSIBLE? */}
      {/* <Padder>
        <View style={styles.resultsView}>
            <Text style={styles.allResults}>
              Distance:
            </Text>
            <Text style={{...styles.resultsText, ...styles.allResults}}> {state.distance} </Text>
        </View>
        <View style={{...styles.resultsView, borderBottomWidth: 1,}}>
            <Text style={styles.allResults}>
              Bearing:
            </Text>
            <Text style={{...styles.resultsText, ...styles.allResults}}> {state.bearing} </Text>
        </View>
      </Padder> */}


      {/* <Padder>
        <View style={{height: '60%'}}>
          <FlatList
            // keyExtracor={(item) => item.text}
            data={historyState}
            renderItem={renderHistory}
            ItemSeparatorComponent={itemSeparatorRender}
            extraData={historyState}
          />
        </View>
      </Padder> */}
      
      {/* {renderWeather(weatherState1)}
      {renderWeather(weatherState2)} */}

  </Padder>  
  );
};

const styles = StyleSheet.create({
  renderItemStyle: {
    padding: 2,
    // borderBottomWidth: 1,
    borderColor: 'black',
  },
  historyTextStyle: {
    fontSize: 18,
  },
  timestampStyle: {
    // borderWidth: 1,
    alignSelf: 'flex-end',
    fontSize: 12,
    fontStyle: 'italic',
  },
  buttons: {
    margin: 10,
  },
  weatherPointStyle: {
    flexDirection: 'row',
    backgroundColor: '#AA7FB9',
  },
  weatherIconStyle: {
    justifyContent: 'center',
  },
  weatherTempStyle: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  weatherDescStyle: {
    marginBottom: 5,
    fontSize: 16,
  },
  weatherPointNumberStyle: {
    fontSize: 15,
    paddingLeft: 15,
    paddingTop: 10,
    // alignSelf: 'center',
  },
  input: {
    color: 'red',
  },
  resultsView: {
    // flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000000',
  },
  resultsText:{
    borderLeftWidth: 1,
    borderColor: '#000000',
    alignSelf: 'center',
    width: '50%',
  },
  allResults: {
    padding: 5,
    fontWeight: 'bold',
  },
  navTouchStyle: {
    flexDirection: 'row',
    justifyContet: 'flex-end',
    alignItems: 'center',
  },
  navTextStyle: {
    fontSize: 15,
  },
});

export default UpdateScreen;
