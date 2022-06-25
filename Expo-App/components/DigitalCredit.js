import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image, StatusBar, FlatList, StyleSheet } from "react-native";

import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { CircleButton, RectButton, SubInfo, DetailsDesc, DetailsBid, FocusedStatusBar, Loading } from ".";
import {firebase, getStorage} from '../firebase'

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
      right={10}
      top={10}
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
  const [barcode , setBarcode] = useState(null)
  const [logo , setLogo] = useState(null)


  // useEffect(()=> {getBarcode(data.filename);})
  useEffect(()=> {
      // getBarcode(data._id);
      // setLogo(data.url_scan_image);
      // setBarcode('https://firebasestorage.googleapis.com/v0/b/invertible-fin-335322.appspot.com/o/barcode.png?alt=media&token=3ece088e-8be9-4e4a-b6ed-869db0fe7ead');
      getBarcode(data.creditID)
      if (data.market=='super-pharm') {
        setLogo('https://firebasestorage.googleapis.com/v0/b/invertible-fin-335322.appspot.com/o/%D7%A1%D7%95%D7%A4%D7%A8-%D7%A4%D7%90%D7%A8%D7%9D-%D7%A9%D7%99%D7%A8%D7%95%D7%AA-%D7%9C%D7%A7%D7%95%D7%97%D7%95%D7%AA-%D7%9C%D7%95%D7%92%D7%95.jpg?alt=media&token=96ae2941-01be-4710-8366-59b2180f1c60')
      }
      else {
        setLogo('https://firebasestorage.googleapis.com/v0/b/invertible-fin-335322.appspot.com/o/Walmart.png?alt=media&token=48f0d6f0-fb49-4cde-80be-d6838ede4613')
  
      }
  // getBarcode2('/Walmart.png');
  })


  const getBarcode = (val)=>{
      fetch(`http://${route.params.url}/scan_credit_controller/get_barcode`, {
          method: 'GET',
          body: JSON.stringify({
              'credit_id' : val,
          }),
          headers: {
              'content-type': 'aplication/json',
          },
      }).then(res => res.text()).then(data => {
        console.log(data);
        setBarcode(data);
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
          {data.date_of_credit.slice(0,10)}
        </Text>
        <Text
          style={styles.text_header_date}>
          {data.date_of_credit.slice(11,16)}
        </Text>
        <Text
          style={styles.text_header}
          >
          Credit Number: {data.creditID}
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
          Total: {data.total_price.toFixed(2)}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.large,
            color: COLORS.primary,
            alignContent: "center",
          }}
          >
          Expiration Date: {data.expiration_date.slice(0,11)}
        </Text>
            <Image style={{height:'10%', width:'60%', paddingBottom:'50%',paddingTop:'10%'}} resizeMode='contain' source={{uri: barcode}}/>
            
            <Image style={{height:'10%', width:'50%', paddingBottom:'20%',paddingTop:'10%'}} resizeMode='contain' source={{uri: logo}}/>
            <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} buttonText={"Download"} />
            
            </View>
          </React.Fragment>
          
          
      
    </SafeAreaView>:
     <View
      style={{
        width: "100%",
        // flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        marginVertical: SIZES.base,
        padding: SIZES.base,
      }}>
        <Loading/>
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
