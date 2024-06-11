import { Button, Input, Image } from '@rneui/themed';
import { 
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Padder from '../components/Padder';
import { FontAwesome } from '@expo/vector-icons';
import {
  inithw4DB,
  storeHistoryItem,
  setupHistoryListener,
} from '../helpers/fb-CoPantry';
import { getWeather, getStatus } from '../api/OWServer';

const ICONS = {
  img01d: require('../assets/images/img01d.png'),
  img01n: require('../assets/images/img01n.png'),
  img02d: require('../assets/images/img02d.png'),
  img02n: require('../assets/images/img02n.png'),
  img03d: require('../assets/images/img03d.png'),
  img03n: require('../assets/images/img03n.png'),
  img04d: require('../assets/images/img04d.png'),
  img04n: require('../assets/images/img04n.png'),
  img09d: require('../assets/images/img09d.png'),
  img09n: require('../assets/images/img09n.png'),
  img10d: require('../assets/images/img10d.png'),
  img10n: require('../assets/images/img10n.png'),
  img13d: require('../assets/images/img13d.png'),
  img13n: require('../assets/images/img13n.png'),
  img50d: require('../assets/images/img13d.png'),
  img50n: require('../assets/images/img13n.png'),
 };
 

const CalculatorScreen = ({ route, navigation }) => {
  
  const measurements = {
    lat1: '',
    lon1: '',
    lat2: '',
    lon2: '',
    distance: '',
    bearing: '',
  }


// to save history
const [historyState, setHistoryState] = useState([]);

const [weatherState1, setWeatherState1] = useState({
  weatherPoint: 'Point 1',
  // weatherError: false,
  weatherDesc: '',
  temp: '',
  icon: '',
});
const [weatherState2, setWeatherState2] = useState({
  weatherPoint: 'Point 2',
  // weatherError: false,
  weatherDesc: '',
  temp: '',
  icon: '',
});

const updateWeatherState1 = (vals) => {
  // console.log('---- In updateStateObject ', vals);
  setWeatherState1({
    ...weatherState1,
    ...vals,
  });
};

const updateWeatherState2 = (vals) => {
  // console.log('---- In updateStateObject ', vals);
  setWeatherState2({
    ...weatherState2,
    ...vals,
  });
};

useEffect(() => {

})

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
  

  const [distanceUnits, setDistanceUnits] = useState('kilometers');
  const [bearingUnits, setBearingUnits] = useState('degrees');
  const [state, setState] = useState(measurements);

  const updateStateObject = (vals) => {
    // console.log('---- In updateStateObject ', vals);
    setState({
      ...state,
      ...vals,
    });
  };


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
          onPress={() => {
            navigation.navigate(
              'History',
              {historyState}
            );
            console.log('headerLeft (History) clicked!');
            Keyboard.dismiss();
          }}
        >
          <Text style={styles.navTextStyle}> History </Text>
        </TouchableOpacity>
      )
    });
    if (route.params?.valueD) {
      setDistanceUnits(route.params.valueD);
      calculateResults();
    };
    if (route.params?.valueB) {
      setBearingUnits(route.params.valueB);
      calculateResults();
    };
    if (
      route.params?.p1Lat &&
      route.params?.p1Lon &&
      route.params?.p2Lat &&
      route.params?.p2Lon
    ) {
      // set state measurements
      console.log('----->>> Update params from HistoryScreen detected. Items passed: \n',
        {
          lat1: route.params.p1Lat,
          lon1: route.params.p1Lon,
          lat2: route.params.p2Lat,
          lon2: route.params.p2Lon,
        }
      );
      // clear any values written by user before using history
      updateStateObject({
        lat1: '',
        lon1: '',
        lat2: '',
        lon2: '',
      });
      // set values based on history params
      updateStateObject({
        lat1: route.params.p1Lat,
        lon1: route.params.p1Lon,
        lat2: route.params.p2Lat,
        lon2: route.params.p2Lon,
      });
  
    }
  },
  [
    route.params?.valueD,
    route.params?.valueB,
    route.params?.p1Lat,
    route.params?.p1Lon,
    route.params?.p2Lat,
    route.params?.p2Lon,
    distanceUnits,
    bearingUnits,
    // historyState, <-- infinite loop no touchy
  ]);


  function convertDistance (dist) {
    // convert here according to distanceUnits state
    if (distanceUnits === 'miles') {
      return (dist *= 0.621371);
      // (number from:
      // https://www.splashlearn.com/math-vocabulary/kilometer-to-mile-conversion#:~:text=Multiply%20by%200.62137-,1%20kilometer%20is%20equal%20to%200.621371%20miles%20(often%20shortened%20to,number%20of%20kilometers%20by%200.621371.
      // )
    } else {
      return dist;
    };
  };

  function convertBearing (bear) {
    // convert here according to bearingUnits state
    if (bearingUnits === 'mils') {
      return (bear *= 17.777778);
      // (number from: 
      // https://www.inchcalculator.com/convert/degree-to-mil/#:~:text=To%20convert%20a%20measurement%20in,ratio%3A%2017.777778%20mils%2Fdegree.&text=The%20angle%20in%20mils%20is,in%20degrees%20multiplied%20by%2017.777778.
      // )
    } else {
      return bear;
    };
  };


  // Converts from degrees to radians.
  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  // Converts from radians to degrees.
  function toDegrees(radians) {
    return (radians * 180) / Math.PI;
  }

  // Computes distance between two geo coordinates in kilometers.
  function computeDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km (change this constant to get miles)
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return `${d}`;    // NOTE: removed round() to avoid double rounding error in conversion
  }

  // Computes bearing between two geocoordinates in degrees.
  function computeBearing(startLat, startLng, destLat, destLng) {
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);

    var y = Math.sin(destLng - startLng) * Math.cos(destLat);
    var x =
      Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    var brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    return (brng + 360) % 360;
  }

  function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }

  function validate(value) {
    return isNaN(value) ? 'Must be a number' : '';
  }

  function formValid(vals) {
    if (
      isNaN(vals.lat1) ||
      isNaN(vals.lon1) ||
      isNaN(vals.lat2) ||
      isNaN(vals.lon2)
    ) {
      return false;
    } else if (
      vals.lat1 === '' ||
      vals.lon1 === '' ||
      vals.lat2 === '' ||
      vals.lon2 === ''
    ) {
      return false;
    } else {
      return true;
    }
  }

  const renderWeather = (weather) => {
    if (weather.icon === '') {
      return (<View></View>)
    } else {
      return (
        <View style={{marginLeft: 9, marginRight: 9, marginTop: 10}}>
          <View style={styles.weatherPointStyle}>
              <View style={styles.weatherIconStyle}>
                <Image
                  source={ICONS['img' + weather.icon]}
                  style={{width: 80, height: 80}}
                  PlaceholderContent={<ActivityIndicator/>}
                />
              </View>
            <View>
              <Text style={styles.weatherTempStyle}>
                {round(weather.temp, 0)}
              </Text>
              <Text style={styles.weatherDescStyle}>
                {weather.weatherDesc}
              </Text>
            </View>
            <Text style={styles.weatherPointNumberStyle}>
              {weather.weatherPoint}
            </Text>
          </View>
        </View>
      )
    }
  };


  function calculateResults() {
    if (formValid(state)) {
      var p1 = {
        lat: parseFloat(state.lat1),
        lon: parseFloat(state.lon1),
      };
      var p2 = {
        lat: parseFloat(state.lat2),
        lon: parseFloat(state.lon2),
      };

      // compute into kilometers
      var dist = computeDistance(p1.lat, p1.lon, p2.lat, p2.lon);
      // compute into degrees
      var bear = computeBearing(p1.lat, p1.lon, p2.lat, p2.lon);

      // convert (if necessary <-- "if" is handled in the function)
      dist = convertDistance(dist);
      bear = convertBearing(bear);

      updateStateObject({
        distance: `${round(dist, 3)} ${distanceUnits}`,
        bearing: `${round(bear, 3)} ${bearingUnits}`,
      });
      Keyboard.dismiss();
    }
  };

  
  return (
    <Padder>
      <Input
        placeholder='Enter latitude for point 1'
        value={state.lat1.toString()}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validate(state.lat1)}
        onChangeText={(val) => updateStateObject({ lat1: val })}
      />
      <Input
        placeholder='Enter longitude for point 1'
        value={state.lon1.toString()}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validate(state.lon1)}
        onChangeText={(val) => updateStateObject({ lon1: val })}
      />
      <Input
        placeholder='Enter latitude for point 2'
        value={state.lat2.toString()}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validate(state.lat2)}
        onChangeText={(val) => updateStateObject({ lat2: val })}
      />
      <Input
        placeholder='Enter longitude for point 2'
        value={state.lon2.toString()}
        autoCorrect={false}
        errorStyle={styles.input}
        errorMessage={validate(state.lon2)}
        onChangeText={(val) => updateStateObject({ lon2: val })}
      />

      <Padder>
        <Button
          style={styles.buttons}
          title='Calculate'
          onPress={() => {
            calculateResults();
            // create timestamp and store the points to persistent Firebase DB memory
            if (formValid(state) === true) { // (repeated line, also in calculateResults())
              var p1 = {
                lat: parseFloat(state.lat1),
                lon: parseFloat(state.lon1),
              };
              var p2 = {
                lat: parseFloat(state.lat2),
                lon: parseFloat(state.lon2),
              };
              let timeOfCalc = new Date().toString();
              storeHistoryItem({p1, p2, timeOfCalc});
              // get and set weather for start point
              // clear weather first
              updateWeatherState1({
                // weatherError: false,
                weatherDesc: '',
                temp: '',
                icon: '',
              });
              updateWeatherState2({
                // weatherError: false,
                weatherDesc: '',
                temp: '',
                icon: '',
              });
              getWeather(state.lat1, state.lon1, (data1) => {
                console.log('DATA1: ', data1);
                updateWeatherState1({
                  weatherDesc: data1.weather[0].main,
                  temp: data1.main.temp,
                  icon: data1.weather[0].icon,
                })
              });

              // get and set weather for end point
              getWeather(state.lat2, state.lon2, (data2) => {
                console.log('DATA2: ', data2);
                updateWeatherState2({
                  weatherDesc: data2.weather[0].main,
                  temp: data2.main.temp,
                  icon: data2.weather[0].icon,
                })
              });
              
              // // stuff for testing request status
              // getStatus(state.lat1, state.lon1, (dataStatus1) => {
              //   console.log('--- data1 status: ', dataStatus1);
              // });
              // getStatus(state.lat2, state.lon2, (dataStatus2) => {
              //   console.log('--- data2 status: ', dataStatus2);
              // });

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
            setState({
              lat1: '',
              lon1: '',
              lat2: '',
              lon2: '',
              distance: '',
              bearing: '',
            });
            updateWeatherState1({
              // weatherError: false,
              weatherDesc: '',
              temp: '',
              icon: '',
            });
            updateWeatherState2({
              // weatherError: false,
              weatherDesc: '',
              temp: '',
              icon: '',
            });
            // reset params so can click similar history
            route.params.p1Lat = '';
            route.params.p1Lon = '';
            route.params.p2Lat = '';
            route.params.p2Lon = '';
          }}
        />
      </Padder>


      
      {/*
      <Padder>
        <Button
          style={styles.buttons}
          title='Send Req and LOG'
          onPress={() => {
            console.log('-------- FROM CALCULATOR --------');
            console.log('ASYNC -- returned weather JSON:' );
            // test data that should return 'Allendale' for "name":
              // let lat = 42.97199453892559;
              // let lon = -85.89032577316132;
            getWeather(state.lat1, state.lon1, (data) => {
              console.log('DATA: ', data);
              updateWeatherState1({
                weatherDesc: data.weather[0].main,
                temp: data.main.temp,
                icon: data.weather[0].icon,
              });
              // console.log('weatherState1: ', weatherState1);
              console.log('---------------------------------');
            });
          }}
        />
      </Padder>
      */}

      {/*          
      <Padder>
        <Button
          style={styles.buttons}
          title='LOG weatherState1 and weatherState2'
          onPress={() => {
            console.log('-------- FROM CALCULATOR --------');
            console.log('weatherState1: ', weatherState1);
            console.log('weatherState2: ', weatherState2);
            console.log('---------------------------------');
          }}
        />
      </Padder>
      */}

      {/* 
      <Padder>
        <Button
          style={styles.buttons}
          title='LOG'
          onPress={() => {
            console.log('-------- FROM CALCULATOR --------');
            console.log('route.params in Calculator (from Settings):', route.params);
            console.log('actual distanceUnits in Calculator:', distanceUnits);
            console.log('actual bearingUnits in Calculator:', bearingUnits);
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
            console.log('-------- FROM CALCULATOR --------');
            console.log(
              'history params: ', 
              {lat1: route.params.p1Lat,
              lon1: route.params.p1Lon,
              lat2: route.params.p2Lat,
              lon2: route.params.p2Lon}
            );
            console.log('---------------------------------');
          }}
        />
      </Padder> */}

      {/* <Padder>
        <Button
          style={styles.buttons}
          title='DB STORE TEST'
          onPress={() => {
            console.log('-------- FROM CALCULATOR --------');
            // writeData('score', {distanceUnits, bearingUnits});
            // writeData('score', ['wankeeeeeeeerrrr', 'shaaaank']);
            storeHistoryItem(['persistant test']);
            console.log('---------------------------------');
          }}
        />
      </Padder> */}

      {/* <Padder>
        <Button
          style={styles.buttons}
          title='LOG historyState'
          onPress={() => {
            console.log('-------- FROM CALCULATOR --------');
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
            console.log('-------- FROM CALCULATOR --------');
            console.log('state: ', state);
            console.log('---------------------------------');
          }}
        />
      </Padder> */}


      {/* CAPITALIZE FIRST LETTER IF POSSIBLE? */}
      <Padder>
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
      </Padder>

      
      {renderWeather(weatherState1)}
      {renderWeather(weatherState2)}

  </Padder>  
  );
};

const styles = StyleSheet.create({
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
  navTextStyle: {
    fontSize: 15,
  },
});

export default CalculatorScreen;
