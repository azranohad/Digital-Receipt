import React, { useState, useEffect } from "react";
import { View, SafeAreaView, FlatList, StyleSheet, Text } from "react-native";

import { ProductCard, HomeHeader, SimpleSearch, FocusedStatusBar } from "../components";
// import {SimpleSearch} from "../components/SimpleSearch";
import { COLORS } from "../constants";

const Products = () => {
  const [JsonData, setJsonData] = useState([]);
  const [userKey, setuserKey] = useState('');
  const [isLoading, setisLoading] = useState(true);
  const [found, setFound]= useState(false);


  useEffect(()=>{
    getIdandProducts();
},[]);

// get id of user and all his receipts
const getIdandProducts = async () => {
  // try {
  //   const value = await AsyncStorage.getItem('userKey')
  //   if(value !== null) {
  //     console.log("getdata: ",value);
  //     setuserKey(value);
  //   }
  // } catch(e) {
  //   // error reading value
  // }
  setuserKey("fd18ed355cd74ae38799f76dc7d20609");
  // getImg("p");
  //getProducts("fd18ed355cd74ae38799f76dc7d20609");
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


  const searchByName = (val)=>{
    console.log(val);
    fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_name`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user-key': userKey,
            'name_search' : val,
        },
    }).then(res => res.json()).then(data => {
      setAll(data);
  });
}



if (isLoading){
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          {/* <FlatList
            data={Object.values(JsonData)}
            renderItem={({ item }) => <ProductCard data={item}/>}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<SimpleSearch/>}
          /> */}
          {/* <SimpleSearch handleSearch={()=>console.log("jk")}/> */}
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
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },});
export default Products;
