import React, { useState, useEffect, useRef } from 'react'
import {StyleSheet,Text, TextInput,View,StatusBar, ImageBackground,ActivityIndicator, KeyboardAvoidingView} from 'react-native'
import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { CircleButton, RectButton, PopUp, Loading } from "../components";
import  AsyncStorage  from '@react-native-async-storage/async-storage';

import Modal from "react-native-modal";
import  {firebase} from '../firebase';
import { useFocusEffect } from '@react-navigation/native';



const ScanReceipts = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
  const [image, setImage] = useState(null)
  const [popUp, setPopUp] = useState(false);
  const [first, setFirst] = useState(true)
  const [chooseAction, setChooseAction] = useState(false);
  const [userKey, setuserKey] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [name, setName] = useState('')
  const [market, setMarket] = useState('')
  const [expireDate, setExpireDate] = useState('')
  const [specUrl, setSpecUrl] = useState('')
  const [isReceipt, setisReceipt] = useState(true)
  const [isUpLoading, setisUpLoading] = useState(false);
  const [JsonData, setJsonData] = useState([]);

  // useEffect(() => {
  //   if (navigation.isFocused()) {
  //     resetReviews(); // replace with your function
  //   }
  // }, [navigation.isFocused()]);
  useFocusEffect(
    React.useCallback(()=>{
      // getId();
      // console.log("hereeee");
      setChooseAction(false)
      setPopUp(false)
      
    },[]));
  useEffect(() => {
    if (navigation.isFocused()) {
    ;(async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === 'granted')
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermission(galleryStatus.status === 'granted')
    })();
    setChooseAction(false);
    getId();}
  }, [navigation.isFocused()])


  const getId = async () => {
    try {
      const value = await AsyncStorage.getItem('userId')
      if(value !== null) {
        console.log("getdata: ",value);
        setuserKey(value);
      }
    } catch(e) {
      // error reading value
    }
  }

  const setisReceiptData = (bool) => {
    setisReceipt(bool);
    setFirst(false);
    if (bool){
      setSpecUrl('scan_receipt_controller');
    }
    else {
      setSpecUrl('scan_credit_controller');
    }
  }



  const sendImage= async (local_uri) =>{
    setImage(local_uri);
    setisUpLoading(true);
    setModalVisible(true);
    // uploadImg(local_uri);
    
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let filename = local_uri.split('/').pop();
    const formData = new FormData();
     // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let img = { uri: local_uri, name: filename, type }
    // let img = { uri: local_uri, name: filename, type: 'image/jpeg' }

    formData.append('image', img);
    formData.append('user_key', userKey);
    fetch(`http://${route.params.url}/${specUrl}/scan`, {
      method: 'POST',
      body:formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    }).then(res => res.json()).then(data => {
      console.log("response: ", data);
      if (isReceipt) {
        console.log("rec:",data.date_of_receipt!="None");
        data.date_of_receipt!="None"?setDate(data.date_of_receipt):setDate('');
      }
      else {
        console.log("credit:",data.date_of_credit!="None");
        data.date_of_credit!="None"?setDate(data.date_of_credit):setDate('');
      }
      data.market!="None"?setMarket(data.market):setMarket('');
      setJsonData(data);
      setisUpLoading(false);
      setPopUp(true);

      // setisUpLoading(false);
      // setImageId(data._id);
      // setPopUp(true);
    });
  }

  async function takeAndUploadPhotoAsync() {
    // Display the camera to the user and wait for them to take a photo or to cancel
    // the action
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });
    if (result.cancelled) {
      return;
    }
    setChooseAction(false)
    sendImage(result.uri);
  }

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    })
    
    if (result.cancelled) {
      return;
    }
    setChooseAction(false)
    sendImage(result.uri);
  }



  const sendUpdates = async () => {
    setImage(null);
    // setPopUp(false);
    setModalVisible(false);
    
    //Alert.alert("Uploaded successfully!                       ");

    // setImage(null);
    // setPopUp(false);
    // setModalVisible(false);
  

    // setImage(image);
    var full_url='';
    // setPopUp(false);
    if (!isReceipt){
      JsonData.expire_date = expireDate;
      full_url = `http://${route.params.url}/${specUrl}/update_credit_data`;
      JsonData.date_of_credit = date;
      JsonData.is_digital_credit = false;
    }
    else {
      full_url = `http://${route.params.url}/${specUrl}/update_receipt_data`
      JsonData.date_of_receipt = date;
      JsonData.is_digital_receipt = false;
    }
    amount==""?JsonData.total_price = 0:JsonData.total_price = Number(amount);
    name==""?JsonData.name_for_client=(new Date()).toString().slice(0,15):JsonData.name_for_client = name;
    JsonData.user_key = userKey;
    JsonData.market = market;
    
    console.log(JsonData);

    
    //JsonData.filename = filename
    //JsonData.uri = uri
    //const newS = JSON.stringify(obj)
    console.log("news: ", JsonData)


    fetch(full_url, {
      method: 'PATCH',
      body:JSON.stringify(JsonData),
      headers: {
        'content-type': 'aplication/json',
    },
    }).then(()=>{

      isReceipt? navigation.navigate("Receipts"): navigation.navigate('Store Credits');
    }
    );
  }

  const setType = (val)=>{
    setisReceipt(val);
    setisReceiptData(val);
    setChooseAction(true);
  }

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>
  }



  return (

    <View 
    style={{
      width: "100%",
      height: "100%",
    }}
  >
    {!isUpLoading && <ImageBackground
       source={assets.nft01}
       resizeMode="cover"
       style={{
        //  width: "100%",
        //  height: "100%",
         borderTopLeftRadius: SIZES.font,
         borderTopRightRadius: SIZES.font,
         paddingTop: 450,
        //  paddingBottom: 100,
         alignItems:"center",
        //  flex: 1,
         justifyContent: "center",
        }}
     >
      {!chooseAction && !isUpLoading && !popUp &&<> 
        <View style={{padding: SIZES.base}}>
                <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} buttonText={"Receipt"} handlePress={()=>setType(true)}/>
        </View>
        <View style={{padding: SIZES.base}}>
                <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} buttonText={"Store Credit"} handlePress={()=>setType(false)}/>
        </View>
      </>}
      {chooseAction&& !isUpLoading && <> 
        <CircleButton
      imgUrl={assets.left}
      handlePress={() => setChooseAction(false)}
      right={10}
      top={50}
      // top={StatusBar.currentHeight}

    />
        <View style={{padding: SIZES.base}}>
                <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} buttonText={"Scan"} handlePress={()=>takeAndUploadPhotoAsync()}/>
        </View>
        <View style={{padding: SIZES.base}}>
                <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} buttonText={"Choose From Gallery"} handlePress={()=>pickImageFromGallery()}/>
        </View>
      </>}


        <View style={{flexDirection: "column-reverse", height:"110%", width:"45%"} }>

       </View>


     {popUp && !isUpLoading &&
     <Modal
     animationType="slide"
     transparent={true}
     modalBackGround="blue"
     onBackdropPress={() => setModalVisible(false)}
     backdropColor="black"
     visible={modalVisible}
   >
        <PopUp data={JsonData} 
        handleConfirm={sendUpdates} setAmount={setAmount} setExpireDate={setExpireDate} 
        setDate={setDate} setMarket={setMarket} setName={setName} scanned_date={date} scanned_store={market}
        isReceipt={isReceipt} />

   </Modal>
}   
</ImageBackground>}
    {isUpLoading &&     <View 
    style={{
      width: "100%",
      height: "100%",
      alignItems:"center",
      flex: 1,
    }}
  >
    <ImageBackground
       source={assets.nft01}
       resizeMode="cover"
       style={{
         width: "100%",
         height: "100%",
         borderTopLeftRadius: SIZES.font,
         borderTopRightRadius: SIZES.font,
        //  paddingTop: 450,
        //  paddingBottom: 100,
         alignItems:"center",
         flex: 1,
         justifyContent: "center",
        }}
     >
       <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.text_header_date}>Loading...</Text>

     </ImageBackground>
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
  input: {
    width: 350,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e8e8e8'
  },
  text_header_date: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    padding: 10,
    alignContent: "center"
  },
  textcontainer: {
    // fontWeight: 'bold',
    width: 350,
    fontFamily: FONTS.semiBold,
    textAlign: 'right',
    alignItems:'center',
    padding: 0,
    borderRadius: 1,
    // borderWidth:1,
    borderColor:'#dcdcdc',
    marginTop: 10,
    marginBottom: 0,
    backgroundColor: COLORS.lightgray,
    color: COLORS.primary,
    fontSize: 16,


  },
});

export default ScanReceipts

