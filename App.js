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
  Platform,
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
const [primaryColors, setPrimaryColor] = useState([])


// GetColor Pick 
const getColorPick = async (e,index) =>{
  console.log("locX, locY = " + e +index);

   console.log("pageX, pageY = " + e.nativeEvent.pageX + ", " + e.nativeEvent.pageY);

   const pressX = e.nativeEvent.pageX - x
   const pressY = e.nativeEvent.pageY - y

   ImageColorPick.getPixels(filePath.uri.replace("file:",""), pressX, pressY, width, height)
  .then((image) => {
    console.log(image)
    setColor1("#"+image.pixels);
    primaryColors[index] = "#"+image.pixels;
    setPrimaryColor(primaryColors)
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
        getPrimaryColor(response.assets[0].uri);
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
      getPrimaryColor(response.assets[0].uri);
    });
  };


  // Primary Color List 
  const getPrimaryColor = async (uri) => {
    if(Platform.OS == 'android'){

    ImageColorPick.getPrimaryColorPixels(uri.replace("file:",""),width, height,x,y)
    .then((image) => {
      console.log(image)
      // setPrimaryColor(image)
    })
    .catch((err) => {
      console.error(err);
    });
   }else{
    ImageColorPick.getPrimaryColorPixels(uri.replace("file:",""),(err ,deviceId) => {
      console.log(err,deviceId);
   });       

   }
  }


  return (
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
             {primaryColors.map((item,index) => {
               return(
                  <View key={index} style={{position:'absolute'}}>
                    <Draggable  x={-110} y={102}  style={{borderWidth: 5, borderColor:"white"}} renderColor={item} renderText={index.toString()} isCircle  onDragRelease={(e)=> getColorPick(e,index)} />
                    <Draggable/>
                  </View>
               )
              }
           )}
        
         <View style={{backgroundColor:"white",justifyContent:'center',width:'100%',height:'10%',flexDirection:'row'}}>
             {primaryColors.map((item,index) => {
               return(
                  <View key={index} style={{width:50,height:65,backgroundColor:item,}}></View>
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
    width: "60%",
    height: "40%",
    margin: 5,
  },
});

