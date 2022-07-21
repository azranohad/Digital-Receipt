import React, { useState, useEffect } from "react";

import { COLORS, FONTS, SIZES, assets } from "../constants";
import { StyleSheet, TextInput, View, Button, Text, SafeAreaView, FlatList,TouchableOpacity,Image} from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { ProductCard, HomeHeader, FocusedStatusBar, SearchHeader, Loading } from "../components";
import { useFocusEffect } from '@react-navigation/native';


const Products = ({route, navigation}) => {
  const [found, setFound]= useState(false);
  const [filter, setFilter]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [userKey, setuserKey] = useState('');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [image, setImage] = useState(null)

  useFocusEffect(
    React.useCallback(async ()=>{
      if (userKey==''){
        try {
          const value = await AsyncStorage.getItem('userId')
          if(value !== null) {
            console.log("getdata: ",value);
            setuserKey(value);
            getAllProducts(value);
          }
        } catch(e) {
          // error reading value
        }
      }
      else {
        setFilter(false)
        getAllProducts(userKey);
      }
    },[]));
 

  // set all variables:
  const setAll = (data)=>{
    let len = (Object.keys(data)).length;
    if (len==0){
      setFound(false);
    }
    else {
      setJsonData(data);
      setFound(true);
    }
    setisLoading(false)
  }

const getByStore = (val)=> {
  fetch(`http://${route.params.url}/recommendation_system_controller/get_recommendation_for_store`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key': userKey,
          'store_name' : val
      },
  }).then(res => res.json()).then(data => {
    setAll(data);
    setFilter(true);
    setStoreName('');
});
}



const getAllProducts = (val)=> {
  fetch(`http://${route.params.url}/recommendation_system_controller/get_general_recommendation`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key' : val,
      },}).then(res=>res.json()).then(data => 
      {
    setOriginal(data);
    setAll(data);

});
}

const getImg =  async (uri)=> {
  setImage(uri);
  // // setisLoading(true);
  // const res = await fetch(uri)
  // const blob = await res.blob();
  // const filename = uri.substring(uri.lastIndexOf('/')+1);
  // var ref = firebase.storage().ref().child(filename).put(blob);
  // try {
  //   await ref;
  // } catch (e){
  //   console.log(e);
  // }
  // Alert.alert('Photo uploaded');
  // await firebase.storage().ref().child(filename).getDownloadURL(ref).then( img => {
  //   setImage(img);
  // })
//   fetch(`http://${route.params.url}/scan_receipt_controller/get_image_receipt`, {
//       method: 'GET',
//       headers: {
//           'content-type': 'multipart/form-data',
//           'user_key' : userKey,
//           '_id' : val,
//       },
//   }).then(res => 
//     res.json()).then(res => {
//     const imageBlob = res.blob();
//     const imageObjectURL = URL.createObjectURL(imageBlob);
// });
}

const trashReceipt = (val)=> {
  fetch(`http://${route.params.url}/scan_receipt_controller/delete_receipt`, {
      method: 'DELETE',
      body: JSON.stringify({
        'user_key': userKey,
          '_id' : val,
      }),
      headers: {
          'content-type': 'aplication/json',
      },
  }).then(res => res.text()).then(data => {
    console.log(data);
    if (data=='True'){
      Object.values(JsonData).map((account)=>{
        if (account._id==val){
          let x = JsonData[account._id]
          console.log(x);
          console.log(JsonData[val]);
          delete JsonData[val]
      }
        })
    }
  setAll(JsonData);
});
}



  if (!isLoading){
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FocusedStatusBar backgroundColor={COLORS.primary} />
        <View style={{ flex: 1 }}>
          <View style={{ zIndex: 0 }}>
            <FlatList
              data={Object.values(JsonData)}
              renderItem={({ item }) => <ProductCard data={item}/>}
              keyExtractor={(item) => item.itemID}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={<SearchHeader handleSearch={(val)=>getByStore(val)} searchByName={searchByName} setSearchByName={setSearchByName} original={original} setJsonData={setJsonData} filter={filter} setFilter={setFilter}/>}
            />
          </View>
  
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              zIndex: -1,
            }}
          >
            <View
              style={{ height: 300, backgroundColor: COLORS.primary }} />
            <View style={{ flex: 1, backgroundColor: COLORS.white }} />
          </View>
        </View>
      </SafeAreaView>
    )
}
else {
  return null
    // <Loading/>
    // <View style={styles.container}> 
    //   <Text>Loading...</Text>
    //   </View>

  
}
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
  },
  input: {
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e8e8e8'
  },
});
export default Products;
