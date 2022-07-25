
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet,  View,Text, SafeAreaView, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { Card, SearchBar, FocusedStatusBar, Loading } from "../components";
import { COLORS, FONTS, SIZES, assets } from "../constants";
import {LogBox} from "react-native";

LogBox.ignoreLogs([
"exported from 'deprecated-react-native-prop-types'.",
])

const MyStoreCreditsScreen = ({route}) => {
  const[updateScreen,setUpdateScreen]=useState(true)
  const [filter, setFilter]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [userKey, setuserKey] = useState('');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setisLoading] = useState(false);


  useFocusEffect(
    React.useCallback(()=>{
      if (!filter){
        getIdandCredits();
        console.log("filter");
      }
  },[updateScreen, filter, userKey]));

 
  const getIdandCredits = async () => {
    try {
      const value = await AsyncStorage.getItem('userId')
      if(value !== null) {
        setuserKey(value);
        getStores(userKey);
        getAllCredits(value);
      }
    } catch(e) {
      // error reading value
    }
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
        setJsonData(data);
        setisLoading(false);       
        setFilter(true);

    });
  }
  const getStores = (val)=> {
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
    setJsonData(data);
    setisLoading(false);   
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
   setOriginal(data);
   setJsonData(data);
   setisLoading(false);
});
}

const trashCredit = (val)=> {
  delete JsonData[val]
  setUpdateScreen(!updateScreen)   
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
      if (data=='True'){
        setJsonData(JsonData);
        }
  });
  }

  const getImg =  async (uri)=> {
    navigation.navigate("ScanedImage", {uri})
  }




if (!isLoading){
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          {JsonData?<FlatList
            data={Object.values(JsonData)}
            renderItem={({ item }) => <Card data={item} handlePress={()=>trashCredit(item._id)} 
                                            date={item.expiration_date.slice(0,16)} price={item.total_price}  
                                            receipt={false} handleGetImg={getImg}/>}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<SearchBar data={stores} searchByName={searchByName} 
                                            setSearchByName={(val)=>setSearchByName(val)} 
                                            onSearch={searchName} onSelect={(val)=>getCreditsByStore(val)} 
                                            filter={filter} setFilter={setFilter}
                                            original={original} setJsonData={setJsonData} placeholder={"Search by name..."} storesFilter={true}/>}
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
            style={{ height: "100%", backgroundColor: COLORS.white }} />
          {/* <View style={{ flex: 1, backgroundColor: COLORS.white }} /> */}
        </View>
      </View>
    </SafeAreaView>
  )
}
else {
  return(
   <Loading/>
  )

      }}



export default MyStoreCreditsScreen