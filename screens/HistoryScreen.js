import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Padder from '../components/Padder';
import { setupHistoryListener } from '../helpers/fb-CoPantry';
import { AntDesign } from '@expo/vector-icons';

const HistoryScreen = ({ route, navigation }) => {
  
  // to save history
  const [historyHistoryState, setHistoryHistoryState] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.navTouchStyle}
          onPress={() => {
            navigation.navigate(
              'Geo Calculator'
            );
            console.log('headerLeft (Back to Calculator) clicked!');
          }}
        >
          <AntDesign name="left" size={24} color="black" />
          <Text style={styles.navTextStyle}> Geo Calculator </Text>
        </TouchableOpacity>
      ),
    })
    setupHistoryListener((items) => {
      // console.log('setting HistoryScreen with: ', items);
      setHistoryHistoryState(items); // can sort with self-defined method like: (items.sort(comparator));
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
              'Geo Calculator',
              { // lat and lon info to pass back
                p1Lat: item.p1.lat,
                p1Lon: item.p1.lon,
                p2Lat: item.p2.lat,
                p2Lon: item.p2.lon,
              }
            );
          }}
        >
          <View>
            <Text style={styles.historyTextStyle}> Start: {item.p1.lat}, {item.p1.lon} </Text>
            <Text style={styles.historyTextStyle}> End: {item.p2.lat}, {item.p2.lon} </Text>
            <Text style={styles.timestampStyle}> {item.timeOfCalc} </Text>
          </View>
        </TouchableHighlight>
      );
    } catch (e) {
      return(
        <Text style={styles.renderItemStyle}> (ERROR: Potential Invalid Data Entry) </Text>
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
      <FlatList
        // keyExtracor={(item) => item.text}
        data={historyHistoryState}
        renderItem={renderHistory}
        ItemSeparatorComponent={itemSeparatorRender}
      />


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
  
  export default HistoryScreen;
  