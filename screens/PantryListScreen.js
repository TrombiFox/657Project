import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Padder from '../components/Padder';
import { setupHistoryListener } from '../helpers/fb-CoPantry';
import { FontAwesome } from '@expo/vector-icons';


const PantryListScreen = ({ route, navigation }) => {
  
  // to save history
  // to save history (list of all current products)
const [historyState, setHistoryState] = useState([]);

const [distanceUnits, setDistanceUnits] = useState('kilometers');
const [bearingUnits, setBearingUnits] = useState('degrees');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(
              'Settings',
              {distanceUnits: distanceUnits,
              bearingUnits: bearingUnits},
            );
            console.log('headerRight (Settings) clicked!');
            Keyboard.dismiss();
          }}
        >
          <FontAwesome name="gears" size={24} color="black"/>
        </TouchableOpacity>
      ),
      // headerTitleAlign: 'center',  // left here for my own note (how to change style individually)
      // backgroundColor: '#B9DE8A',
      headerLeft: () => (
        <TouchableOpacity
          style={styles.navTouchStyle}
          onPress={() => {
            navigation.navigate(
              'Add Item'
            );
            console.log('headerLeft (Add Item) clicked!');
          }}
        >
          
          <Text style={styles.navTextStyle}> Add Item </Text>
        </TouchableOpacity>
      ),
    })
    setupHistoryListener((items) => {
      // console.log('setting HistoryScreen with: ', items);
      setHistoryState(items); // can sort with self-defined method like: (items.sort(comparator));
      // historyStateTest = historyState;
    });
  }, []);
  
// render the item WITH error catching
let renderHistory = ({ index, item }) => {
  try {
    return(
      <TouchableHighlight style={styles.renderItemStyle}
      activeOpacity={0.6}
      underlayColor='#8EC861'  
      onPress={() => {
          navigation.navigate(
            'View Item',
            {
              item
            }
          );
          console.log("Item click (to View Item): ", item);
        }}
      >
        <View>
          <Text style={styles.historyTextStyle}> Product: {item.state.prodTitle} </Text>
          <Text style={styles.historyTextStyle}> Expiration Date: {item.state.prodExpirationDate} </Text>
          <Text style={styles.historyTextStyle}> Expired? {item.state.prodIsExpired.toString()} </Text>
          <Text style={styles.historyTextStyle}> Picture: {item.state.prodThumbnail} </Text>
          <Text style={styles.timestampStyle}> Added: {item.timeOfAdd} </Text>
        </View>
      </TouchableHighlight>
    );
  } catch (e) {
    return(
      <TouchableHighlight style={styles.renderItemStyle}
      activeOpacity={0.6}
      underlayColor='#8EC861'  
      onPress={() => {
          navigation.navigate(
            'View Item',
            {
              item
            }
          );
          console.log("Item click (to View Item): ", item);
        }}
      >
        <Text style={styles.renderItemStyle}> (ERROR: Potential Invalid Data Entry) </Text>
      </TouchableHighlight>
    );
  }
};


let itemSeparatorRender= () => {
  return(
    <Text style={{backgroundColor: 'black', height: 1}}> </Text>
  )
}

function renderFlatList() {
  // console.log('historyState in FlatList: ', historyState);
  if (historyState.length == 0) {
    return (
      <View>
        <Text style={{alignSelf: 'center', textAlign: 'center', fontSize: 25}}>
          {'\n'}
          No Items Here! {'\n'}
          {'\n'}
          Use "Add Item" in the top left to add some items!
        </Text>
      </View>
    )
  } else {
    return (
      <View style={{height: '100%'}}>
        <FlatList
          // keyExtracor={(item) => item.text}
          data={historyState}
          renderItem={renderHistory}
          ItemSeparatorComponent={itemSeparatorRender}
          extraData={historyState}
        />
      </View>
    )
  };
}


  return (
    <Padder>
      
      {renderFlatList()}


      {/* <Padder>
        <Button
          style={styles.buttons}
          title='LOG route.params'
          onPress={() => {
            console.log('-------- FROM HISTORY --------');
            console.log('historyState: ', route.params);
            console.log('---------------------------------');
          }}
        />
      </Padder> */}

      {/* <Padder>
        <Button
          style={styles.buttons}
          title='LOG historyHistoryState'
          onPress={() => {
            console.log('-------- FROM HISTORY --------');
            console.log('historyHistoryState: ', {historyHistoryState});
            console.log('---------------------------------');
          }}
        />
      </Padder> */}


    </Padder>
  );
};


const styles = StyleSheet.create({
    renderItemStyle: {
      padding: 2,
      // borderBottomWidth: 1,
      borderColor: 'black',
    },
    navTouchStyle: {
      flexDirection: 'row',
      justifyContet: 'flex-end',
      alignItems: 'center',
    },
    navTextStyle: {
      fontSize: 15,
    },
    historyTextStyle: {
      fontSize: 18,
    },
    timestampStyle: {
      // borderWidth: 1,
      alignSelf: 'flex-end',
      fontSize: 12,
      fontStyle: 'italic',
    }
  });
  
  export default PantryListScreen;
  