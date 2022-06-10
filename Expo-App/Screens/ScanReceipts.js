import React, { useState, useEffect, useRef } from 'react'
import {StyleSheet,Text,View,TouchableOpacity,Button,Modal,Image,Animated} from 'react-native'
import { Camera } from 'expo-camera'
//import * as Permission from 'expo-permissions'
//import * as MediaLibrary from 'expo-media-library'
import * as ImagePicker from 'expo-image-picker'
//import { launchCamera } from 'react-native-image-picker';
export default function App(props) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
  const [camera, setCamera] = useState(null)
  const [image, setImage] = useState(null)
  const [first, setFirst] = useState(false)
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const options = {
    quality: 0.5,
    base64: true,
    skipProcessing: true,
  }
  const cameraRef = useRef()

  useEffect(() => {
    ;(async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === 'granted')
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermission(galleryStatus.status === 'granted')
    })()
  }, [])

  const ModalPoup = ({visible, children}) => {
    const [showModal, setShowModal] = React.useState(visible);
    const scaleValue = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
      toggleModal();
    }, [visible]);
    const toggleModal = () => {
      if (visible) {
        setShowModal(true);
        Animated.spring(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        setTimeout(() => setShowModal(false), 200);
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    };
  }

  async function takeAndUploadPhotoAsyncccc() {
    // Display the camera to the user and wait for them to take a photo or to cancel
    // the action
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true,
    })
    if (result.cancelled) {
      return
    }
  
    //console.log(result);
    //setImage(result.uri);
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = result.uri
    let filename = localUri.split('/').pop()
    // try {
    //   const response = await API.post("/scan_receipt", { "image": result.base64, "user_name" : 'shoval' });
    // }
    // catch(err){
    //   console.log(err);
    //   console.log("error sending data");
    // }
    // Upload the image using the fetch and FormData APIs
    // let formData = new FormData();
    // // // Assume "photo" is the name of the form field the server expects
    // formData.append('image', { uri: localUri, name: 'receipt#1', type: result.type });
    // // formData.append('user_name', "shoval");
    // return await fetch("http://127.0.0.1:5000/scan_receipt", {
    //   method: 'POST',
    //   body: JSON.stringify(formData),
    //   headers: {
    //     'content-type': 'multipart/form-data',
    //   },
    // });
    console.log(result.base64.length)
    var base64Icon = `data:image/png;base64,${result.base64}`

    setImage(base64Icon)

    fetch(
      'https://4faeb637-e3f0-403a-ab6c-4b8ab598b196.mock.pstmn.io/scan_receipt',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: result.base64.slice(0,100),
          user_name: 'yourOtherValue',
        }),
      },
    )
    //   fetch('https://4faeb637-e3f0-403a-ab6c-4b8ab598b196.mock.pstmn.io/scan_receipt', { method: 'POST',
    //     headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     'image': result.base64.slice(2000000,3000000),
    //     'user_name': 'yourOtherValue'
    //   })
    // });
  }


  async function takeAndUploadPhotoAsync() {
    // Display the camera to the user and wait for them to take a photo or to cancel
    // the action
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (result.cancelled) {
      return;
    }
    setImage(result.uri);
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = result.uri;
    let filename = localUri.split('/').pop();
    const formData = new FormData();
    // // Assume "photo" is the name of the form field the server expects
    let y = { uri: localUri, name: filename, type: 'image/jpeg' }
    formData.append('image', y);
    formData.append('user_key', "shoval");
    console.log(formData);

    fetch(`http://192.168.0.111:5000/scan_receipt_controller/scan_receipt`, {
      method: 'POST',
      body:formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    }).then(res => res.json()).then(data => {
      console.log(data);

    });
    // method: 'POST',
    //         headers: {
    //           Accept: 'application/json',
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           image: result.base64.slice(0,100),
    //           user_name: 'yourOtherValue',
    //         }),
    //       },
    // );
    console.log("sent");
    return;

    // let filename = localUri.split('/').pop();
  
    // // Infer the type of the image
    // let match = /\.(\w+)$/.exec(filename);
    // let type = match ? `image/${match[1]}` : `image`;
  
    // // Upload the image using the fetch and FormData APIs
    // let formData = new FormData();
    // // Assume "photo" is the name of the form field the server expects
    // formData.append('photo', { uri: localUri, name: filename, type });
    // console.log("formData", formData);
    // return await fetch('https://4faeb637-e3f0-403a-ab6c-4b8ab598b196.mock.pstmn.io/scan_receipt', {
    //   method: 'POST',
    //   body: JSON.stringify({formData}),
    //   headers: {
    //     'content-type': 'multipart/form-data',
    //   },
    // });
  }

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      allowsEditing: true,
    })
    console.log(result)
    if (!result.cancelled) {
      setImage(result.uri)
    }
  }

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      {!image && <Button title="Scan" onPress={()=>takeAndUploadPhotoAsync()}></Button>}
      {!image && <Button title="Choose From Gallery" onPress={()=> pickImageFromGallery()}></Button>}
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
      {image && <Button title="Submit" onPress={()=>{setVisible(true); setSubmit()}}></Button>}
      {visible && <View>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Image
                source={require('../Images/x.png')}
                style={{height: 30, width: 30}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          {/* <Image
            source={require('../Images/success.png')}
            style={{height: 150, width: 150, marginVertical: 10}}
          /> */}
          <Text>Total Amount is: 120$</Text>
          <Text>Store: Super-Pharm</Text>
          <Text>Date: 12/04/2022</Text>
          <Button title="Confirm" onPress={()=>{setImage(null);setVisible(false);}}></Button>
        </View>
      </View>}

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
    // shoval added
    // These below are most important, they center your border view in container
    // ref: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
    alignItems: 'center',
    justifyContent: 'center',
    //
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    flex: 1,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});


