import { View, Text, SafeAreaView, Image, FlatList , StyleSheet} from "react-native";
import React, {useState, useEffect} from "react";
import { COLORS, SIZES, assets, SHADOWS, FONTS, Images } from "../constants";
import { CircleButton, RectButton,ItemDetails, FocusedStatusBar, Loading } from ".";

const BackButton = ({navigation }) => (
  <View style={{ width: "100%", height: 110 }}>
    <CircleButton
      imgUrl={assets.left}
      handlePress={() => navigation.navigate("Receipts")}
      right={SIZES.rightHeight}
      top={SIZES.topHeight}
    />
  </View>
  
);

const DigitalShow= ({ route, navigation }) => {
  const { data } = route.params;
  const [barcode , setBarcode] = useState(null)
  const [logo , setLogo] = useState(null)

  useEffect(()=> {
    let isCancelled = false;
    setBarcode(Images.Barcode)
    if (data.market=='super-pharm') {
      setLogo(Images.SuperPharmLogo);
    }
    else if (data.market=="Fox"){
      setLogo(Images.FoxLogo)
    }
    else {
      setLogo(Images.WalmartLogo)
    }
    return () => {
      isCancelled = true;
    };
  })


const getBarcode = (val)=>{
  fetch(`http://${route.params.url}/scan_receipt_controller/get_barcode`, {
      method: 'GET',
      body: JSON.stringify({
          'receipt_id' : val,
      }),
      headers: {
          'content-type': 'aplication/json',
      },
  }).then(res => res.text()).then(data => {
    setBarcode(data);
  })
}

  const getLogo = (val)=>{
    fetch(`http://${route.params.url}/scan_receipt_controller/get_barcode`, {
        method: 'GET',
        body: JSON.stringify({
            'store_name' : val,
        }),
        headers: {
            'content-type': 'aplication/json',
        },
    }).then(res => res.text()).then(data => {
      setBarcode(data);
    })
  }

  return (
    logo && barcode ?<SafeAreaView style={{ flex: 1 }}>
      <BackButton data={data} navigation={navigation} />
      <FocusedStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <FlatList
        data={data.items}
        renderItem={({ item }) => <ItemDetails item={item} />}
        keyExtractor={( item ) =>item.itemID}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: SIZES.extraLarge * 3,
          paddingLeft: SIZES.large*1.5,
          paddingRight: SIZES.large*1.5,
        }}
        ListFooterComponent={()=>(
          <React.Fragment>
            <View
        style={{
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
          Total: {data.total_price.toFixed(2)}
        </Text>
            <Image style={{height:'10%', width:'60%', paddingBottom:'50%',paddingTop:'10%'}} resizeMode='contain' source={{uri: barcode}}/>
            
            <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} buttonText={"Download"} handlePress={()=>{}} />
            
            </View>
          </React.Fragment>
        )}
        ListHeaderComponent={() => (
          <React.Fragment>
            <View
      style={{
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: SIZES.base,
        paddingHorizontal: SIZES.base,
      }}>
        <Image style={{height:'10%', width:'50%', paddingBottom:'20%',paddingTop:'10%'}} resizeMode='contain' source={{uri: logo}}/>
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
          {data.date_of_receipt.slice(0,16)}
        </Text>
        <Text
          style={styles.text_header_date}>
          {data.date_of_receipt.slice(17,22)}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.medium,
            color: COLORS.primary,
            alignContent: "center",
            paddingBottom: SIZES.extraLarge,
          }}
        >
          Receipt Number: {data.receiptID}
        </Text>

      </View>
          </React.Fragment>
          )}
      />
    </SafeAreaView>:
    <Loading/>
  
  );
};


const styles = StyleSheet.create({
  text_header_date: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    alignContent: "center"
  }
});

export default DigitalShow;
