import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button, Text, SafeAreaView, FlatList } from 'react-native';
import { DataTable } from 'react-native-paper';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { NFTCard, HomeHeader, FocusedStatusBar } from "../components";
import { COLORS, NFTData } from "../constants";
import { event } from 'react-native-reanimated';
import  {firebase} from '../firebase';


const MyReceiptsScreen = ({navigation, route}) => {
  const [found, setFound]= useState(false);
  const [filter, setFilter]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [userKey, setuserKey] = useState('');
  const [fromDate, setfromDate] = useState('1/1/1950');
  const [toDate, settoDate] = useState('1/1/2023');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [image, setImage] = useState(null)



  useEffect(()=>{
    if (userKey==''){
      getIdandReceipts();
    }
    else {
      getAllReceipts("fd18ed355cd74ae38799f76dc7d20609");
      getStores("fd18ed355cd74ae38799f76dc7d20609");

      // getAllReceipts(userKey);
    }
 },[]);
 
  // get id of user and all his receipts
  const getIdandReceipts = async () => {
    // try {
    //   const value = await AsyncStorage.getItem('userKey')
    //   if(value !== null) {
    //     console.log("getdata: ",value);
    //     setuserKey(value);
    //     getAllReceipts(value);
    //   }
    // } catch(e) {
    //   // error reading value
    // }
    setuserKey("fd18ed355cd74ae38799f76dc7d20609");
    getAllReceipts("fd18ed355cd74ae38799f76dc7d20609");
    getStores("fd18ed355cd74ae38799f76dc7d20609");
  }


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


  // default receipts view -  by date_of_receipt
  async function getReceiptsByDate() {
    setisLoading(true);
    fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_date`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user_key': userKey,
            'from_date': fromDate,
            'to_date': toDate,
        },
    }).then(res => res.json()).then(data => {
      setAll(data);
    });
  }
    
    const searchName = (s)=> {
      // setisLoading(true);
      console.log(s);
      fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_name`, {
          method: 'GET',
          headers: {
              'content-type': 'aplication/json',
              'user-key': userKey,
              'name_search' : s,
          },
      }).then(res => res.json()).then(data => {
        setAll(data);
    });
  }

  const getStores = (val)=> {
    // setisLoading(true);
    fetch(`http://${route.params.url}/scan_receipt_controller/get_markets`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user-key': val,
        },
    }).then(res => res.json()).then(data => {
      console.log(data);
      setStores(data);
  });
}

const getReceiptsByStore = (val)=> {
  // setisLoading(true);
  fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_market`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user-key': userKey,
          'market' : val
      },
  }).then(res => res.json()).then(data => {
    setAll(data);
    setFilter(true);
});
}

const getAllReceipts = (val)=> {
  fetch(`http://${route.params.url}/scan_receipt_controller/get_all_receipts_user`, {
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
  // setisLoading(true);
  const res = await fetch(uri)
  const blob = await res.blob();
  const filename = uri.substring(uri.lastIndexOf('/')+1);
  var ref = firebase.storage().ref().child(filename).put(blob);
  try {
    await ref;
  } catch (e){
    console.log(e);
  }
  Alert.alert('Photo uploaded');
  await firebase.storage().ref().child(filename).getDownloadURL(ref).then( img => {
    setImage(img);
  })
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
              renderItem={({ item }) => <NFTCard data={item} handlePress={()=>trashReceipt(item._id)} date={item.date_of_receipt.slice(0,-13)} price={item.total_price} receipt={true} handleGetImg={getImg}/>}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={<HomeHeader data={stores} onSelect={(val)=>getReceiptsByStore(val)} filter={filter} setFilter={()=>setFilter()} Type={"Receipt"}/>}
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
              style={{ height: 300, backgroundColor: COLORS.midnightblue }} />
            <View style={{ flex: 1, backgroundColor: COLORS.white }} />
          </View>
        </View>
      </SafeAreaView>
    )
}
else {
  return (
    <View style={styles.container}> 
      <Text>Loading...</Text>
      </View>

  )
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

export default MyReceiptsScreen




