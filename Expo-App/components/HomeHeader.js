import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Image, TextInput } from "react-native";
import { Colors } from "react-native-paper";
import { DataTable } from 'react-native-paper';

import { COLORS, FONTS, SIZES, assets } from "../constants";

const HomeHeader = ({  }) => {
  const [show, setShow] = useState(false);
  const [placeholder, setPlaceHolder] = useState('Search By Name..');

  const [found, setFound]= useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [userKey, setuserKey] = useState('');
  const [fromDate, setfromDate] = useState('1/1/1950');
  const [toDate, settoDate] = useState('1/1/2023');
  const [JsonData, setJsonData] = useState([]);
  const [original, setOriginal] = useState([]);
  const [isLoading, setisLoading] = useState(true);

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
    // setisLoading(true);
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

  const getStores = ()=> {
    // setisLoading(true);
    fetch(`http://${route.params.url}/scan_receipt_controller/get_markets`, {
        method: 'GET',
        headers: {
            'content-type': 'aplication/json',
            'user-key': userKey,
        },
    }).then(res => res.json()).then(data => {
      console.log(data);
  });
}

const getReceiptsByStore = ()=> {
  // setisLoading(true);
  fetch(`http://${route.params.url}/scan_receipt_controller/get_receipt_by_market`, {
      method: 'GET',
      headers: {
          'content-type': 'aplication/json',
          'user-key': userKey,
          'market' : storeName
      },
  }).then(res => res.json()).then(data => {
    setAll(data);
});
}





  return (
    <View
      style={{
        backgroundColor: COLORS.midnightblue, //primary
        padding: SIZES.font,
        paddingTop: 20,
        paddingLeft:50,
        paddingRight:50,
        paddingBottom:20,
      }}
    >
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          source={assets.logo}
          resizeMode="contain"
          style={{ width: 90, height: 25 }}
        />

        <View style={{ width: 45, height: 45 }}>
          <Image
            source={assets.person01}
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
          <Image
            source={assets.badge}
            resizeMode="contain"
            style={{
              position: "absolute",
              width: 15,
              height: 15,
              bottom: 0,
              right: 0,
            }}
          />
        </View>
      </View> */}

      {/* <View style={{ marginVertical: SIZES.font }}>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: SIZES.small,
            color: COLORS.white,
          }}
        >
          Hello Victoria 👋
        </Text>

        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: SIZES.large,
            color: COLORS.white,
            marginTop: SIZES.base / 2,
          }}
        >
          Let’s find masterpiece Art
        </Text>
      </View> */}

      <View style={{ marginTop: SIZES.font }}>
        <View
          style={{
            width: "100%",
            borderRadius: 30,
            backgroundColor: COLORS.lightgray,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: SIZES.font,
            paddingVertical: SIZES.small - 2,
          }}
        >
          <TouchableOpacity onPress={()=>{searchName(searchByName)}} >
            <Image
              source={assets.search}
              resizeMode="contain"
              style={{ width: 20, height: 20, marginRight: SIZES.base }}
              />
          </TouchableOpacity>
            <TextInput
              placeholder={placeholder}
              style={{ flex: 1 }}
              onChangeText={val=>setSearchByName(val)}
              />
      <TouchableOpacity onPress={()=>setShow(!show)}>
        <Image source={assets.filter}></Image>
        </TouchableOpacity>
    </View>
      {show && <>
      <DataTable.Header>
        <DataTable.Title></DataTable.Title>
      </DataTable.Header>
      <DataTable.Row style={{alignContent:'center', alignItems:'center'}}>
          <DataTable.Cell style={{backgroundColor: 'aqua'}} onPress={()=>{
            setPlaceHolder('Search By Store'); 
            setShow(false);}}>Search By Store</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row style={{alignContent:'center', alignItems:'center'}}>
          <DataTable.Cell style={{backgroundColor: 'aqua'}} onPress={()=>{setPlaceHolder('Search By '); setShow(false);}}>Search By Store</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row style={{alignContent:'center', alignItems:'center'}}>
          <DataTable.Cell style={{backgroundColor: 'aqua'}} onPress={()=>{setPlaceHolder('Search By OOO'); setShow(false);}}>Search By Store</DataTable.Cell>
        </DataTable.Row>
        </>}
      </View>
        </View>
  );
};

export default HomeHeader;
