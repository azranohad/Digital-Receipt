import React, { useState, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SIZES, assets } from "../constants";
import { StyleSheet, TextInput, View, Button, Text, SafeAreaView, FlatList,ImageBackground,TouchableOpacity,Image, ActivityIndicator} from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { ProductCard, SearchBar, FocusedStatusBar, Loading } from "../components";
import { setAutoServerRegistrationEnabledAsync } from "expo-notifications";

const Products = ({route, navigation}) => {
  const [filter, setFilter]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [userKey, setuserKey] = useState('');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useFocusEffect(
    React.useCallback(()=>{
console.log("useFocusEffect products");
      if (!filter){
        getIdandProducts();
        console.log("filter");
      }
  },[ filter, userKey]));


  const getIdandProducts = async () => {
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



  const findStores = (val) => {
      let stores = {};
      let index = 0;
      let arr = []
      stores[index++] = 'All';
      
      Object.values(val).map((p)=>{
        if (!arr.includes(p.market)){
          stores[index++] = p.market;
          arr.push(p.market)
        }
      })
      console.log("stores: ", stores);
      setStores(stores);
  }

const getByStore = (val)=> {
  setJsonData([])
  fetch(`http://${route.params.url}/recommendation_system_controller/get_recommendation_for_store`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key': userKey,
          'store_name' : val
      },
  }).then(res => res.json()).then(data => {
    setJsonData(data);
    setFilter(true);
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
      findStores(data);
    setOriginal(data);
    setJsonData(data);
    setisLoading(false);

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
              ListHeaderComponent={<SearchBar data={stores} onSelect={(val)=>getByStore(val)} searchByName={searchByName}
                                    setSearchByName={setSearchByName} original={original} setJsonData={setJsonData} 
                                    filter={filter} setFilter={setFilter} placeholder={"Search by store..."} 
                                    storesFilter={false}/>}
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

  
}
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
  },
  text_header_date: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    padding: 10,
    alignContent: "center"
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
