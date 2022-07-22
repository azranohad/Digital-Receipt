
import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button, Text, SafeAreaView, FlatList } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { NFTCard, HomeHeader, FocusedStatusBar, Loading } from "../components";
import { COLORS, NFTData } from "../constants";
import { event } from 'react-native-reanimated';

const MyStoreCreditsScreen = ({navigation, route}) => {
  const [found, setFound]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [userKey, setuserKey] = useState('');
  const [fromDate, setfromDate] = useState('1/1/1950');
  const [toDate, settoDate] = useState('1/1/2023');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [image, setImage] = useState(null)
  const [stores, setStores] = useState([]);
  const [filter, setFilter]= useState(false);
  const [text, setText] = React.useState("waiting...");



  useEffect(()=>{
    let isCancelled = false;

    if (!filter){
      //setAll([]);
      if (userKey==''){
        getIdandCredits().then(() => {
          if (!isCancelled) {
            setText("done!");
          }
      })}
      else {
        getAllCredits(userKey).then(()=>{
          if (!isCancelled) {
            setText("done!");
          }
         })
        getStores(userKey).then(()=>{
          if (!isCancelled) {
            setText("done!");
          }
         })
      }
    }
    return () => {
      isCancelled = true;
    };

    },[]);
  // useFocusEffect(
  //   React.useCallback(()=>{
  //     setAll([]);
  //     if (userKey==''){
  //       getIdandCredits();
  //     }
  //     else {
  //       getAllCredits(userKey);
  //       getStores(userKey);
  //     }
  //   },[]));
 
 
  const getIdandCredits = async () => {
    try {
      const value = await AsyncStorage.getItem('userId')
      if(value !== null) {
        console.log("getdata: ",value);
        setuserKey(value);
        getAllCredits(value);
        getStores(userKey);
      }
    } catch(e) {
      // error reading value
    }
    // setuserKey(userKey);
    // getAllCredits(userKey);
    // getStores(userKey);
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

  // default store credits view -  by date.
  async function getCreditsByDate() {
    fetch(`http://${route.params.url}/scan_credit_controller/get_all_credits_user`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user_key' : userKey,
            'from_date': fromDate,
            'to_date': toDate,
        },
    }).then(res => res.json()).then(data => {
      setAll(data);
    });
  }
    
    const searchName = (s)=> {
 
      fetch(`http://${route.params.url}/scan_credit_controller/get_credit_by_name`, {
          method: 'GET',
          headers: {
              'content-type': 'aplication/json',
              'user_key' : userKey,
              'name_search' : s,
          },
      }).then(res => res.json()).then(data => {
       setAll(data);
       setFilter(true);

    });
  }
  const getStores = (val)=> {
    setisLoading(true);
    fetch(`http://${route.params.url}/scan_credit_controller/get_markets`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user_key' : val,
        },
    }).then(res => res.json()).then(data => {
      setStores(data);

  });
}

const getCreditsByStore = (val)=> {
  fetch(`http://${route.params.url}/scan_credit_controller/get_credit_by_market`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key' : userKey,
          'market' : val,
      },
  }).then(res => res.json()).then(data => {
   setAll(data);
   setFilter(true);

});
}

const getAllCredits = (val)=> {
  fetch(`http://${route.params.url}/scan_credit_controller/get_all_credits_user`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key' : val,
      },
  }).then(res => res.json()).then(data => {
   setAll(data);
   setOriginal(data);
   setisLoading(false);
});
}

const trashCredit = (val)=> {
  fetch(`http://${route.params.url}/scan_credit_controller/delete_credit`, {
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
            console.log(x,val);
            delete JsonData[val]
        }
          })
          console.log(JsonData);
        setJsonData(...JsonData);
      }
  });
  }

  const getImg =  async (uri)=> {
    setImage(uri);
 
  }




// if (!isLoading){
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          {JsonData?<FlatList
            data={Object.values(JsonData)}
            renderItem={({ item }) => <NFTCard data={item} handlePress={()=>trashCredit(item._id)} date={item.expiration_date.slice(0,16)} price={item.total_price}  receipt={false} handleGetImg={getImg}/>}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<HomeHeader data={stores} searchByName={searchByName} setSearchByName={(val)=>setSearchByName(val)} onSearch={searchName} onSelect={(val)=>getCreditsByStore(val)} filter={filter} setFilter={setFilter} Type={"Credit"} setAll={setAll} original={original}/>}
          />:<></>}
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
// }
// else {
// return (
//   // <View style={styles.container}> 

//   //   <Text>Loading...</Text>
//   //   </View>
//   <Loading/>

// )
// }
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

export default MyStoreCreditsScreen