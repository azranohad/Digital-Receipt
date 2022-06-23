import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image, StatusBar, FlatList, StyleSheet } from "react-native";

import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { CircleButton, RectButton, SubInfo, DetailsDesc, DetailsBid, FocusedStatusBar } from ".";
import {firebase} from '../firebase'

const DetailsHeader = ({navigation }) => (
  <View style={{ width: "100%", height: 80 }}>
    {/* <Image
      source={assets.nft01}
      resizeMode="cover"
      style={{ width: "100%", height: "100%" }}
    /> */}

    <CircleButton
      imgUrl={assets.left}
      handlePress={() => navigation.navigate("Store Credits")}
      right={15}
      top={StatusBar.currentHeight + 10}
    />

    {/* <CircleButton
      imgUrl={assets.heart}
      right={15}
      top={StatusBar.currentHeight + 10}
    /> */}
  </View>
  
);

const DigitalCredit= ({ route, navigation }) => {
  const { data } = route.params;
  const [logo , setLogo] = useState(null)


  // useEffect(()=> {getBarcode(data.filename);})
  useEffect(()=> {
    getBarcode(data._id);
    setLogo(data.url_scan_image);
// getBarcode2('/Walmart.png');
},[])


  const getBarcode = (filename)=>{
      fetch(`http://${route.params.url}/scan_receipt_controller/get_barcode`, {
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
        setBarcode(filename);
      })

      // var ref = firebase.storage().ref().child(filename)
      // await firebase.storage().ref(filename).getDownloadURL(ref).then( x => {
      //   setImg(x);
      // })
  }

  return (
    
    logo && barcode ? <SafeAreaView style={{  flex: 1}}>
      <DetailsHeader data={data} navigation={navigation} />

      <FocusedStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
        style={{flex:1,
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'center'}}
      />
          <React.Fragment>
            {/* <SubInfo /> */}
            <View
      style={{
        width: "100%",
        // flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        marginVertical: SIZES.base,
        paddingHorizontal: SIZES.base,
      }}>

    <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.extraLarge+5,
            color: COLORS.primary,
            alignContent: "center"
          }}
        >
          {data.market}
        </Text>
        <Text style={styles.text_header_date}>
          {data.date_of_receipt.slice(0,-13)}
        </Text>
        <Text
          style={styles.text_header_date}>
          {data.date_of_receipt.slice(-13,-7)}
        </Text>
        <Text
          style={styles.text_header}
          >
          Credit Number: {data.receiptID}
        </Text>
            </View>
            <View
      style={{
        width: "100%",
        // flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: SIZES.base,
        paddingHorizontal: SIZES.base,
      }}>

          <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.extraLarge,
            color: COLORS.primary,
            alignContent: "center",
          }}
          >
          Total: {data.total_price.toFixed(2)}$
        </Text>
        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.large,
            color: COLORS.primary,
            alignContent: "center",
          }}
          >
          Expiration Date: {data.date_of_receipt.slice(4,-13)}
        </Text>
            <Image style={{height:'10%', width:'60%', paddingBottom:'50%',paddingTop:'10%'}} resizeMode='contain' source={{uri: barcode}}/>
            
            <Image style={{height:'10%', width:'50%', paddingBottom:'20%',paddingTop:'10%'}} resizeMode='contain' source={{uri: logo}}/>
            <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} buttonText={"Download"} />
            
            </View>
          </React.Fragment>
          
          
      
    </SafeAreaView>: <View
      style={{
        width: "100%",
        // flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        marginVertical: SIZES.base,
        padding: SIZES.base,
      }}>
        <Text>Loading...</Text>
      </View>
  );
};


const styles = StyleSheet.create({
  text_header: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    alignContent: "center",
    paddingBottom: SIZES.extraLarge,
  },
  text_header_date: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    alignContent: "center"
  },
  image : {
    width: '100%',
    height: 'auto',
  }
});

export default DigitalCredit;
