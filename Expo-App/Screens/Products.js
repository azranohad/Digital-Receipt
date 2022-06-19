import React, { useState } from "react";
import { View, SafeAreaView, FlatList } from "react-native";

import { NFTCard, HomeHeader, FocusedStatusBar } from "../components";
import SimpleSearch from "../components/SimpleSearch";
import { COLORS, NFTData } from "../constants";

const Products = () => {
  const [JsonData, setJsonData] = useState([]);
  const [userKey, setuserKey] = useState('');
  const [isLoading, setisLoading] = useState(true);

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



if (!isLoading){
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          <FlatList
            data={Object.values(JsonData)}
            renderItem={({ item }) => <NFTCard data={item} handlePress={()=>trashReceipt(item._id)} handleImage={()=>getImg(item._id)}/>}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<HomeHeader/>}
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
  <TextInput value={searchByName}
      onChangeText={(searchByName) => searchName(searchByName)}
      placeholder={'Search Receipt'}/>   
    <Button title='Search' onPress={()=>{getReceiptsByStore();}}></Button> 
    <Text>Loading...</Text>
    </View>

)
}
}

export default Products;
