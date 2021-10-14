/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useRef,useState} from 'react';
import Draggable from 'react-native-draggable';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  NativeModules,
  PermissionsAndroid
} from 'react-native';


const { ImageColorPick } = NativeModules;




const App = () => {
const [color1, setColor1] = useState("");
const [filePath, setFilePath] = useState({});

const [x, setX] = useState(0)
const [y, setY] = useState(0)
const [width, setWidth] = useState(0)
const [height, setHeight] = useState(0)


const getColorPick = (e) =>{
  console.log("locX, locY = " + e);

   console.log("pageX, pageY = " + e.nativeEvent.pageX + ", " + e.nativeEvent.pageY);

   const pressX = e.nativeEvent.pageX - x
   const pressY = e.nativeEvent.pageY - y

   ImageColorPick.getPixels(filePath.uri.replace("file:",""), pressX, pressY, width, height)
  .then((image) => {
    console.log(image)
    setColor1("#"+image.pixels);
  })
  .catch((err) => {
    console.error(err);
  });

  }

  
  // Camera Permission 
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  // external Write Permission
  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };


   // external Read Permission
   const requestReadWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'External Storage Read Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };
  // Capture Image 
  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    let isReadStoragePermitted = await requestReadWritePermission();
    if (isCameraPermitted && isStoragePermitted && isReadStoragePermitted) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setFilePath(response.assets[0]);
      });
    }
  };


  // Choose File 
  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath(response.assets[0]);
    });
  };


  
  return (
    // <View style={{ width: "100%",height:"100%"}} >
    
    //   {/* <Image 
    //     style={{ width: "100%",height:"100%",backgroundColor:"yellow"}}
    //     source={require('./assets/tiny_logo.png')}
    //   /> */}
    //   {/* <Image
    //     style={{ width: "100%",height:"100%",backgroundColor:"transparent"}}
    //     source={{
    //       uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
    //     }}
    //   /> */}
    //     <Image
    //     style={{ width: "100%",height:"100%",position:"absolute"}}
    //     source={require('./assets/tiny_logo.png')}
    //     />
    //   <ViewShot ref={(elem)=> setCount(elem)} options={{ format: "jpg", quality: 0.9 }} style={{width:100,height:100,position:"absolute",top:top,left:left,right:right,bottom:bottom}}>
    //      <Text>dsjfsdjhfjsdafhhjdsfhdjfjadfjhhjdsfhjasdhjfhjasdfhjjhds</Text>
      
    //   </ViewShot>
    //   <Draggable  x={100} y={200} renderColor={color1} renderText=' ' isCircle  onDragRelease={(e)=> getColorPick(e)} />
    //   <Draggable/>
    // </View>

     
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Image
          onLayout={(e) => {
            setX(e.nativeEvent.layout.x)
            setY(e.nativeEvent.layout.y)
            setWidth(e.nativeEvent.layout.width)
            setHeight(e.nativeEvent.layout.height)
          }}
          source={{uri:filePath.uri}}
          style={styles.imageStyle}
        />
        <Draggable  x={100} y={200} style={{ borderWidth: 5, borderColor:"white",}} renderColor={color1} renderText=' ' isCircle  onDragRelease={(e)=> getColorPick(e)} />
         <Draggable/>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('photo')}>
          <Text style={styles.textStyle}>
            Launch Camera for Image
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('photo')}>
          <Text style={styles.textStyle}>Choose Image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>

  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: "100%",
    height: "60%",
    margin: 5,
  },
});

