
// Expo Camera
// initial code taken from documentation:
// https://docs.expo.dev/versions/latest/sdk/camera/#types

import { CameraView, useCameraPermissions, takePic } from 'expo-camera';
import React, { useEffect, useState, useRef } from 'react';
import { Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
// import * as MediaLibray from 'expo-media-library';
import { AntDesign } from '@expo/vector-icons';

const CameraScreen = ({ route, navigation }) => {

  // const [cameraRef, setCameraRef] = useState();
  let cameraRef = useRef();
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState();

  


  // const [mediaPermission, setMediaPermission] = useState();


  //  // maybe later
  // useEffect => {
  //   (async () => {
  //     const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
  //   }) ();
  // }, []);


  useEffect(() => {
    navigation.setOptions({
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
          <AntDesign name="left" size={24} color="black" />
          <Text style={styles.navTextStyle}> Cancel </Text>
        </TouchableOpacity>
      ),
    })
    // things to do
  }, []);



  

  let takePic = async() => {
    let options={
      quality: 1,
      base64: true,
      exif: false
    };
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    // console.log(newPhoto)
    // console.log(photo)
    console.log('end of setting newPhoto');
  };




  if (photo) {
    let savePhoto = () => {
      // navigate(
      //   'Add Item',
      //     (photo.uri)
      // )
      setPhoto(undefined);
    };
    return(
      <View styles={styles.previewContainer}>
        <Text> asshole </Text>
        <Image
          style={styles.imagePreview}
          source={{ uri: 'data:image/jpg;base64,' + photo.base64}}
        />
        <Button
          title='Use Photo'
          onPress={savePhoto}
        />
        <Button
          title='Discard Photo'
          onPress={() => {
            setPhoto(undefined)
          }}
        />
      </View>
    );
  }




  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={takePic}
          >
            <Text style={styles.text}> Take Picture </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  imagePreview: {
    alignSelf: 'stretch',
    flex: 1,
  },
  navTextStyle: {
    fontSize: 15,
  },
  navTouchStyle: {
    flexDirection: 'row',
    justifyContet: 'flex-end',
    alignItems: 'center',
  },
});

export default CameraScreen;