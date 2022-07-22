
import React, { useState, Component, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button, Text, SafeAreaView, FlatList } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { NFTCard, HomeHeader, FocusedStatusBar, Loading, RectButton } from "../components";
import { COLORS, FONTS, SIZES, assets } from "../constants";

import { event } from 'react-native-reanimated';

const StoreCreditSoonExpires = ({navigation, route}) => {
    const { store } = route.params;
    const [userKey, setuserKey] = useState('');
    const [JsonData, setJsonData] = useState([]);
    const [text, setText] = React.useState("waiting...");
 

  useEffect( ()=>{
    let isCancelled = false;

      if (userKey==''){
        firstEnter().then(() => {
            if (!isCancelled) {
              setText("done!");
            }
        })
      }
      else {
        getCreditsByStore(userKey,store).then(() => {
            if (!isCancelled) {
              setText("done!");
            }
        })
      }
      return () => {
        isCancelled = true;
      };
    },[]);
 
const firstEnter = async ()=>{
    try {
        const value = await AsyncStorage.getItem('userId')
        if(value !== null) {
          console.log("getdata: ",value);
          getCreditsByStore(value, store);
          setuserKey(userKey)
        }
      } catch(e) {
        // error reading value
      }
}
const getCreditsByStore = (user, store)=> {
  fetch(`http://${route.params.url}/scan_credit_controller/get_credit_by_market`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user_key' : user,
          'market' : store,
      },
  }).then(res => res.json()).then(data => {
   setJsonData(data)
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
                                   <Text style={{fontSize:SIZES.extraLarge}}>Your {store} store credits:</Text>
                            </View>
                                   <RectButton minWidth={80} fontSize={FONTS.small} handlePress={()=> navigation.navigate("Home")} buttonText="Go Back Home" ></RectButton>
                        </View>
                    </View>
          </>}
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
  )}


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

export default StoreCreditSoonExpires