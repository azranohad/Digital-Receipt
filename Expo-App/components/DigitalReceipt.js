import React from "react";
import { View, Text, SafeAreaView, Image, StatusBar, FlatList } from "react-native";

import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { CircleButton, RectButton, SubInfo, DetailsDesc, DetailsBid, FocusedStatusBar } from ".";

const DetailsHeader = ({navigation }) => (
  <View style={{ width: "100%", height: 80 }}>
    {/* <Image
      source={assets.nft01}
      resizeMode="cover"
      style={{ width: "100%", height: "100%" }}
    /> */}

    <CircleButton
      imgUrl={assets.left}
      handlePress={() => navigation.navigate("Receipts")}
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

const DigitalShow= ({ route, navigation }) => {
  const { data } = route.params;

  return (
    
    <SafeAreaView style={{ flex: 1 }}>
      <DetailsHeader data={data} navigation={navigation} />

      <FocusedStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          paddingVertical: SIZES.font,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.5)",
          zIndex: 1,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.medium,
            color: COLORS.primary,
            alignContent: "center",
            paddingBottom: SIZES.extraLarge,
          }}
        >
          Total: {data.total_price.toFixed(2)}$
        </Text>
        <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} buttonText={"Download"} />
      </View>
      
      <FlatList
        data={data.items}
        renderItem={({ item }) => <DetailsBid bid={item} />}
        keyExtractor={( item ) =>item.itemID}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: SIZES.extraLarge * 3,
          paddingLeft: SIZES.large*1.5,
          paddingRight: SIZES.large*1.5,
        }}
        ListHeaderComponent={() => (
          <React.Fragment>
            {/* <SubInfo /> */}
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
            fontSize: SIZES.extraLarge+5,
            color: COLORS.primary,
            alignContent: "center"
          }}
        >
          {data.market}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.large,
            color: COLORS.primary,
            alignContent: "center"
          }}
        >
          {data.date_of_receipt.slice(0,-13)}
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
        
            {/* <View style={{ padding: SIZES.font }}>
              <DetailsDesc data={data} />
              
              
            </View> */}
            
          </React.Fragment>
          
          )}
      />
      
    </SafeAreaView>
  );
};

export default DigitalShow;
