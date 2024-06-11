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
  setupHistoryListener,
} from '../helpers/fb-CoPantry';
import { AntDesign } from '@expo/vector-icons';
 

const AddScreen = ({ route, navigation }) => {
  
  const prodDetails = {
    prodTitle: '',
    prodExpirationDate: '',
    prodDateAdded: '',
    prodDateToBin: '', // if left empty, autoset as expirationDate?
    prodIsExpired: false, // default to false? string or boolean?
    prodThumbnail: '',
    prodPrice: '',
    prodBarcode: '',

    // lat1: '',     // --> prodTitle
    // lon1: '',     // --> prodExpirationDate
    // lat2: '',     // --> prodDateAdded
    // lon2: '',     // --> prodDateToBin
    // distance: '', // --> prodIsExpired
    // bearing: '',  // --> prodThumbnail
  }


// to save history (list of all current products)
const [historyState, setHistoryState] = useState([]);

// set up data listener
useEffect(() => {
  try {
    inithw4DB();
  } catch (err) {
    console.log(err);
  }
  // setupDataListener('score');
  setupHistoryListener((items) => {
    // console.log('setting state with: ', items);
    setHistoryState(items); // can sort with self-defined method like: (items.sort(comparator));
  });
}, []);
  

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

    ////////// bearing and distance left to avoid error temporarily
    // if (route.params?.valueD) {
    //   setDistanceUnits(route.params.valueD);
    // };
    // if (route.params?.valueB) {
    //   setBearingUnits(route.params.valueB);
    // };

    // if (
    //   route.params?.p1Lat &&
    //   route.params?.p1Lon &&
    //   route.params?.p2Lat &&
    //   route.params?.p2Lon
    // ) {
    //   // set state prodDetails
    //   console.log('----->>> Update params from HistoryScreen detected. Items passed: \n',
    //     {
    //       prodTitle: route.params.p1Lat,
    //       prodExpirationDate: route.params.p1Lon,
    //       prodDateAdded: route.params.p2Lat,
    //       prodDateToBin: route.params.p2Lon,
    //     }
    //   );
    //   // clear any values written by user before using history
    //   updateStateObject({
    //     prodTitle: '',
    //     prodExpirationDate: '',
    //     prodDateAdded: '',
    //     prodDateToBin: '',
    //   });
    //   // set values based on history params
    //   updateStateObject({
    //     prodTitle: route.params.p1Lat,
    //     prodExpirationDate: route.params.p1Lon,
    //     prodDateAdded: route.params.p2Lat,
    //     prodDateToBin: route.params.p2Lon,
    //   });
  
    // }
  },
  [
    // route.params?.valueD,
    // route.params?.valueB,
    // route.params?.p1Lat,
    // route.params?.p1Lon,
    // route.params?.p2Lat,
    // route.params?.p2Lon,
    // distanceUnits,
    // bearingUnits,
    // historyState, <-- infinite loop no touchy
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
      <Input
        placeholder='Tap to Take a Picture'
        value={state.prodThumbnail}
        autoCorrect={false}
        errorStyle={styles.input}
        // errorMessage={validateNum(state.lon2)}
        onChangeText={(val) => updateStateObject({ prodThumbnail: val })}
      />

      <Padder>
        <Button
          style={styles.buttons}
          title='Add Item'
          onPress={() => {
            // create timestamp and store the points to persistent Firebase DB memory
            if (formValid(state) === true) {
              let timeOfCalc = new Date().toString();
              storeHistoryItem({state, timeOfCalc});
            };
          }}
        />
      </Padder>

      <Padder>
        <Button
          style={styles.buttons}
          title='Clear'
          onPress={() => {
            Keyboard.dismiss();
            updateStateObject({
              prodTitle: '',
              prodExpirationDate: '',
              prodDateAdded: '',
              prodDateToBin: '',
              prodIsExpired: false,
              prodThumbnail: '',
              prodPrice: '',
              prodBarcode: '',
            });
            
            // WIP FIXME----------------------------------
            // reset params so can click similar history
            // route.params.p1Lat = '';
            // route.params.p1Lon = '';
            // route.params.p2Lat = '';
            // route.params.p2Lon = '';
          }}
        />
      </Padder>



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

export default AddScreen;
