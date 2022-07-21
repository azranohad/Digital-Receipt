import React, { useState, useEffect } from "react";

import { COLORS, FONTS, SIZES, assets } from "../constants";
import { StyleSheet, TextInput, View, Button, Text, SafeAreaView, FlatList,TouchableOpacity,Image} from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { ProductCard, HomeHeader, FocusedStatusBar, SearchHeader, Loading, RectButton } from "../components";
import { useFocusEffect } from '@react-navigation/native';


const StoreProducts = ({route, navigation}) => {
    const { store } = route.params;

    const [userKey, setuserKey] = useState('');
    const [JsonData, setJsonData] = useState([]);
 

  useFocusEffect(
    React.useCallback(async ()=>{
      if (userKey==''){
        try {
          const value = await AsyncStorage.getItem('userId')
          if(value !== null) {
            console.log("getdata: ",value);
            getByStore(store,value);
          }
        } catch(e) {
          // error reading value
        }
      }
      else {
        getByStore(store,userKey);
      }
    },[]));
 



const getByStore = (store, user)=> {
  fetch(`http://${route.params.url}/recommendation_system_controller/get_recommendation_for_store`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key': user,
          'store_name' : store
      },
  }).then(res => res.json()).then(data => {
    setJsonData(data);
});
}


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
              ListHeaderComponent={<>
                    <View style={{
                                backgroundColor: COLORS.primary, //primary
                                padding: SIZES.font,
                                paddingTop: 20,
                                paddingLeft:50,
                                paddingRight:50,
                                paddingBottom:20,
                            }}
                            >
                               
                                <View style={{ marginTop: SIZES.font }}>
                                    <View
                                    style={{
                                        width: "100%",
                                        // borderRadius: 30,
                                        backgroundColor: COLORS.lightgray,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent:"center",
                                        paddingHorizontal: SIZES.font,
                                        paddingVertical: SIZES.small - 2,
                                        alignContent:"center"
                                    }}
                                    >
                                       <Text style={{fontSize:SIZES.extraLarge}}>{store}'s best deals!</Text>
                                </View>
                                       <RectButton minWidth={80} fontSize={FONTS.small} handlePress={()=> navigation.navigate("Home")} buttonText="Go Back Home" ></RectButton>
                            </View>
                        </View>
              </>}
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
export default StoreProducts;
