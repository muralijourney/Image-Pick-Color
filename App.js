/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useRef,useState} from 'react';
// import Draggable from 'react-native-draggable';
import Draggable from './NewDraggable'
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
  Platform,
  Dimensions,
  PermissionsAndroid
} from 'react-native';
import ColorFinder from 'color-finder'

const { ImageColorPick } = NativeModules;

const App = () => {
  const [color, setColor] = useState("");
  const [filePath, setFilePath] = useState({});
  const [layout, setLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  const [colorFinder, setColorFinder] = useState(null);
  const [primaryColors, setPrimaryColors] = useState([]);

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

  // uri.replace("file:","")

  const createColorFinder = () => {
    if (filePath.uri) {
      if (Platform.OS === 'android') {
        console.log('Starting')
        ImageColorPick.getRGBArray(filePath.uri.replace('file:', ''))
        .then(rgbArray => {
          const colorFinder = ColorFinder.fromRGBArray(rgbArray);
          setColorFinder(colorFinder);
          const mainColors = colorFinder.mainColors();
          console.log(mainColors)
          setPrimaryColors(mainColors);
        })
      } else {
        //Not handled yet
        return
      }
    }
  }

  const getColor = (e) => {
    if (colorFinder !== null && colorFinder !== undefined) {
      const x = e.nativeEvent.locationX;
      const y = e.nativeEvent.locationY;
      setColor(colorFinder.colorAtPos(x, y, layout));
    }    
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Image
          onLoad={() => createColorFinder()}
          onLayout={e => setLayout(e.nativeEvent.layout)}
          source={{uri:filePath.uri}}
          style={styles.imageStyle}
          />
          {primaryColors.map((item, index) => {
              const result = colorFinder.locateColorOnPage(item, layout);
              console.log(`x: ${result["x"]}, y: ${result["y"]}`)
               return(

                  <View
                    key={index}
                    style={{
                      position: 'absolute',
                      left: result["x"],
                      top: result["y"],
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      borderColor: 'white',
                      borderWidth: 3,
                      borderStyle: 'solid',
                      backgroundColor: item
                    }}
                  />
               )

                  {/* <View key={index} style={{position:'absolute', margin:5}}>
                    <Draggable 
                      x={x}
                      y={y}
                      minX={0}
                      maxX={layout.width}             
                      minY={0}
                      maxY={layout.height}
                      renderColor={item} 
                      renderText={index.toString()} 
                      isCircle  
                      onDragRelease={e => getColor(e)} />
                    <Draggable/>
                  </View> */}
              }
           )}
        
         <View style={{backgroundColor:"white",justifyContent:'center',width:'100%',height:'10%',flexDirection:'row'}}>
             {primaryColors.map((item,index) => {
               return(
                  <View key={index} style={{width:50,height:65,backgroundColor:item.color,}}></View>
                  
               )
              }
           )}
         </View> 

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
    flexDirection:'column'
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
    height: "65%",
    width:"100%",
    margin: 5,
  },
});

