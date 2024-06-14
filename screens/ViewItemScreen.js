import { Button, Image } from '@rneui/themed';
import { 
  FlatList,
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
  deleteHistoryItem,
} from '../helpers/fb-CoPantry';
import { AntDesign } from '@expo/vector-icons';


const ViewItemScreen = ({ route, navigation }) => {

  const [item, setItem] = useState(route.params.item);

  const [isValidItem, setIsValidItem] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            if (isValidItem) {
              navigation.navigate(
              'Update Item',
              item,
            );
            console.log('headerRight (Update Item) clicked!');
            Keyboard.dismiss();
          }}}
        >
          <Text style={styles.navTextStyle}> Edit Item </Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.navTouchStyle}
          onPress={() => {
            navigation.navigate(
              'Co-Pantry'
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

    if (route?.params) {
      setItem(route.params.item)
      // do not allow Edit Item if invalid item (avoid error)
      if (
        !(route.params.item.state.prodTitle) ||
        !(route.params.item.state.prodExpirationDate) ||
        // !(route.params.item.timeOfAdd) ||
        !(route.params.item.state.prodDateToBin) ||
        // !(route.params.item.state.prodIsExpired) ||
        // !(route.params.item.state.prodThumbnail) ||
        !(route.params.item.state.prodPrice)
        // !(route.params.item.state.prodBarcode)
      ) {setIsValidItem(false)}
    }
  },
  [
    route.params?.item,
    route.params.item,
    isValidItem,  // helps correctly disable Edit Item if item invald
    item,
  ]);



//   function round(value, decimals) {
//     return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
//   }


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


  // // render the item WITH (double) error catching
  let renderItem = ({ index, item }) => {
    if (isValidItem === true) {
      try {
        return(
            <View>
              <Text style={styles.historyTextStyle}> - Product: {item.state.prodTitle} </Text>
              <Text style={styles.historyTextStyle}> - Added: {item.timeOfAdd} </Text>
              <Text style={styles.historyTextStyle}> - Expiration Date: {item.state.prodExpirationDate} </Text>
              <Text style={styles.historyTextStyle}> - Last Day to Use: {item.state.prodDateToBin} </Text>
              <Text style={styles.historyTextStyle}> - Expired? {item.state.prodIsExpired.toString()} </Text>
              <Text style={styles.historyTextStyle}> - Price: {item.state.prodPrice} </Text>
              {tryRenderImage(item.state.prodThumbnail)}
            </View>
        );
      } catch (e) {
        return(
          <View>
              <Text style={styles.renderItemStyle}> (ERROR: Potential Invalid Data Entry) </Text>
          </View>
        );
      }
    } else {
      return(
        <View>
            <Text style={styles.renderItemStyle}> (ERROR: Potential Invalid Data Entry) </Text>
        </View>
      );
    }
  };

  
  return (
    <Padder>
        {/* <Padder>
            <Button
                style={styles.buttons}
                title='LOG item'
                onPress={() => {
                    console.log('-------- FROM VIEW --------');
                    console.log('item being viewed: ', item);
                    console.log('---------------------------------');
                }}
            />
        </Padder> */}

        <Padder>
            <View style={{
                height: '90%',
                backgroundColor: '#D4BAD9',
                borderWidth: 2,
                borderColor: 'black'}}>
              <FlatList style={{flexGrow: 0}}
                  data={[item]}
                  renderItem={renderItem}
                  // ItemSeparatorComponent={itemSeparatorRender}
                  extraData={item}
              />
            </View>
        </Padder>



        {/* <Padder>
          <Button
              style={styles.buttons}
              title='Log isValidItem and params'
              onPress={() => {
                  console.log('-------- FROM VIEW --------');
                  console.log('isValidItem: ', isValidItem);
                  console.log('params: ', route.params.item.timeOfAdd);
                  console.log('---------------------------------');
              }}
          />
        </Padder> */}

        <Padder>
          <Button
              style={styles.buttons}
              title='Delete Item'
              onPress={() => {
                  console.log('-------- FROM VIEW --------');
                  console.log('deleting item: ', item);
                  deleteHistoryItem(item);
                  navigation.navigate(
                      'Co-Pantry'
                    );
                  console.log('---------------------------------');
              }}
          />
        </Padder>

  </Padder>  
  );
};

const styles = StyleSheet.create({
  renderItemStyle: {
    padding: 2,
    borderColor: 'black',
  },
  historyTextStyle: {
    fontSize: 18,
  },
  buttons: {
    margin: 10,
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
    maxHeight: 500,
    // borderColor: 'red',
    // borderWidth: 2,
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

export default ViewItemScreen;
