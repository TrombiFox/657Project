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
  getHistoryItem,
  deleteHistoryItem,
} from '../helpers/fb-CoPantry';
import { AntDesign } from '@expo/vector-icons';


const ViewItemScreen = ({ route, navigation }) => {
    
  let item = route.params.item;



    // const prodDetails = {
    //     prodTitle: '',
    //     prodExpirationDate: '',
    //     prodDateAdded: '',
    //     prodDateToBin: '', // if left empty, autoset as expirationDate?
    //     prodIsExpired: false, // default to false? string or boolean?
    //     prodThumbnail: '',
    //     prodPrice: '',
    //     prodBarcode: '',

    //     // lat1: '',     // --> prodTitle
    //     // lon1: '',     // --> prodExpirationDate
    //     // lat2: '',     // --> prodDateAdded
    //     // lon2: '',     // --> prodDateToBin
    //     // distance: '', // --> prodIsExpired
    //     // bearing: '',  // --> prodThumbnail
    // }


    // // to save history (list of all current products)
    // const [historyState, setHistoryState] = useState([]);

    // // set up data listener
    // useEffect(() => {
    // try {
    //     inithw4DB();
    // } catch (err) {
    //     console.log(err);
    // }
    // // setupDataListener('score');
    // setupHistoryListener((items) => {
    //     // console.log('setting state with: ', items);
    //     setHistoryState(items); // can sort with self-defined method like: (items.sort(comparator));
    // });
    // }, []);
  

    // const [state, setState] = useState(prodDetails);

    // const updateStateObject = (vals) => {
    // // console.log('---- In updateStateObject ', vals);
    // setState({
    //     ...state,
    //     ...vals,
    // });
    // };


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(
              'Update Item',
              item,
            );
            console.log('headerRight (Update Item) clicked!');
            Keyboard.dismiss();
          }}
        >
          <Text style={styles.navTextStyle}> Edit Item </Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.navTouchStyle}
          onPress={() => {
            navigation.navigate(
              'Co-Pantry',
            //   {historyState}
            );
            console.log('headerLeft (To Co-Pantry) clicked!');
            Keyboard.dismiss();
          }}
        >
          <AntDesign name="left" size={24} color="black" />
          <Text style={styles.navTextStyle}> Back </Text>
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



//   function round(value, decimals) {
//     return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
//   }

//   function validateNonEmpty(value) {
//     return !(value) ? 'Required field' : '';
//   }

//   function validateIsNum(value) {
//     return isNaN(value) ? 'Must be a number' : '';
//   }

//   function formValid(vals) {
//     // console.log(vals.prodTitle);
//     if (
//       (!vals.prodTitle) ||  // isNaN is true if NaN is returned after...
//       (!vals.prodExpirationDate) ||     // ... being converted to a number
//       (!vals.prodDateToBin) ||
//       isNaN(vals.prodPrice)
//     ) {
//       return false;
//     } else if (
//       vals.prodTitle === '' ||
//       vals.prodExpirationDate === '' ||
//       vals.prodDateToBin === '' ||
//       vals.prodPrice === ''
//     ) {
//       return false;
//     } else {
//       return true;
//     }
//   }


  // // render the item WITH error catching
  let renderItem = ({ index, item }) => {
    try {
      return(
          <View>
            <Text style={styles.historyTextStyle}> Product: {item.state.prodTitle} </Text>
            <Text style={styles.timestampStyle}> Added: {item.timeOfAdd} </Text>
            <Text style={styles.historyTextStyle}> Expiration Date: {item.state.prodExpirationDate} </Text>
            <Text style={styles.historyTextStyle}> Last Day to Use: {item.state.prodDateToBin} </Text>
            <Text style={styles.historyTextStyle}> Expired? {item.state.prodIsExpired.toString()} </Text>
            <Text style={styles.historyTextStyle}> Picture: {item.state.prodThumbnail} </Text>
            <Text style={styles.historyTextStyle}> Price: {item.state.prodPrice} </Text>

                    

            {/*
            //ATTRIBUTES:
            - prodTitle: '',
            - prodExpirationDate: '',
            - prodDateAdded: '',
            - prodDateToBin: '', // if left empty, autoset as expirationDate?
            - prodIsExpired: false, // default to false? string or boolean?
            - prodThumbnail: '',
            prodPrice: '',
            prodBarcode: '',
            */}

          </View>
      );
    } catch (e) {
      return(
        <View>
            <Text style={styles.renderItemStyle}> (ERROR: Potential Invalid Data Entry) </Text>
            {/* <Text style={styles.renderItemStyle}> Error Reference: {item.id} </Text> */}
        </View>
      );
    }
  };


  let itemSeparatorRender= () => {
    return(
      <Text style={{backgroundColor: 'black', height: 1}}> </Text>
    )
  }
  
  return (
    <Padder>
        <Padder>
            <Button
                style={styles.buttons}
                title='LOG item'
                onPress={() => {
                    console.log('-------- FROM VIEW --------');
                    console.log('item being viewed: ', item);
                    console.log('---------------------------------');
                }}
            />
        </Padder>

        <Padder>
            <Button
                style={styles.buttons}
                title='LOG route.params.item'
                onPress={() => {
                    console.log('-------- FROM VIEW --------');
                    console.log('route.params.item: ', route.params.item);
                    console.log('---------------------------------');
                }}
            />
        </Padder>


        <Padder>
            <View style={{
                height: '70%',
                backgroundColor: '#D4BAD9',
                borderWidth: 2,
                borderColor: 'black'}}>
              <FlatList style={{flexGrow: 0}} // did anything?
                  // keyExtracor={(item) => item.text}
                  data={[item]}
                  renderItem={renderItem}
                  // ItemSeparatorComponent={itemSeparatorRender}
                  extraData={item}
              />
            </View>
        </Padder>



        <Padder>
          <Button
              style={styles.buttons}
              title='Delete Item'
              onPress={() => {
                  console.log('-------- FROM VIEW --------');
                  console.log('deleting item: ', item);
                  deleteHistoryItem(item);
                  navigation.navigate(
                      'Co-Pantry',
                    //   {historyState}
                    );
                  console.log('---------------------------------');
              }}
          />
        </Padder>

  </Padder>  
  );
};

const styles = StyleSheet.create({
  flatListStyle: {

  },
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

export default ViewItemScreen;
