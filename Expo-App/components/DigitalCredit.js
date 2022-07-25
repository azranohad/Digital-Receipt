import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image, StyleSheet } from "react-native";

import { COLORS, SIZES, assets, SHADOWS, FONTS, Images } from "../constants";
import { CircleButton, RectButton, FocusedStatusBar} from ".";


const BackButton = ({navigation }) => (
  <View style={{ width: "100%", height: SIZES.topHeight }}>
    <CircleButton
      imgUrl={assets.left}
      handlePress={() => navigation.navigate("Store Credits")}
      right={SIZES.rightHeight}
      top={SIZES.topHeight}
    />
  </View>
);

  const DigitalCredit= ({ route, navigation }) => {
    const { data } = route.params;
    const [barcode , setBarcode] = useState(null)
    const [logo , setLogo] = useState(null)

    useEffect(()=> {
      let isCancelled = false;
      setBarcode(Images.Barcode)
      setLogo(Images.FoxLogo)
      return () => {
        isCancelled = true;
      };
      },[])


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
        setBarcode(data);
      })

      // var ref = firebase.storage().ref().child(filename)
      // await firebase.storage().ref(filename).getDownloadURL(ref).then( x => {
      //   setImg(x);
      // })
  }

  return (
    logo && barcode ? <SafeAreaView style={{  flex: 1}}>
      <BackButton data={data} navigation={navigation} />
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
      <View style={{
        width: "100%",
        alignItems: "center",
        marginVertical: SIZES.base,
        paddingHorizontal: SIZES.base,
      }}>
      <Image style={{height:'10%', width:'30%', paddingBottom:'50%',paddingTop:'10%'}} resizeMode='contain' source={{uri: logo}}/>
      <Text style={{
        fontFamily: FONTS.semiBold,
        fontSize: SIZES.extraLarge+5,
        color: COLORS.primary,
        alignContent: "center"
      }}> {data.market}
      </Text>
      <Text style={styles.text_header_date}>
        {data.date_of_credit.slice(0,16)}
      </Text>
      <Text style={styles.text_header_date}>
        {data.date_of_credit.slice(17,22)}
      </Text>
      <Text style={styles.text_header}> Credit Number: {data.creditID} </Text>
    </View>
    <View style={{
      width: "100%",
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
    Total: {data.total_price.toFixed(2)}</Text>
    <Text style={{
      fontFamily: FONTS.semiBold,
      fontSize: SIZES.large,
      color: COLORS.primary,
      alignContent: "center",
    }}
    >
    Expiration Date: {data.expiration_date.slice(0,16)}
    </Text>
    <Image style={{height:'10%', width:'50%', paddingBottom:'20%',paddingTop:'10%'}} resizeMode='contain' source={{uri: barcode}}/>
    <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} buttonText={"Download"} handlePress={()=>{}}/>
    </View>
    </React.Fragment>    
  </SafeAreaView>:
    <View style={{
      width: "100%",
      alignItems: "center",
      marginVertical: SIZES.base,
      padding: SIZES.base,
    }}>
      <Text style={styles.text_header_date}>Loading...</Text>
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
});

export default DigitalCredit;
