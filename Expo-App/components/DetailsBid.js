import React from "react";
import { View, Text, Image } from "react-native";

import { EthPrice } from "./SubInfo";
import { COLORS, SIZES, FONTS } from "../constants";

const DetailsBid = ({ bid }) => {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: SIZES.base,
        paddingHorizontal: SIZES.base,
      }}
      key={bid._id}
    >
     
      {/* <Image
        source={bid.image}
        resizeMode="contain"
        style={{ width: 48, height: 48 }}
      /> */}
       <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          paddingHorizontal: SIZES.base,
        }}
      >

      <Text
        style={{
          fontFamily: FONTS.medium,
          fontSize: SIZES.small,
          color: COLORS.primary,

          // paddingRight: SIZES.extraLarge
        }}
        >
        x{bid.amount}
      </Text>
      <EthPrice price={bid.price} />
      </View>
      <View
        style={{
          flex: 1,
          // alignItems: "center",
          paddingHorizontal: SIZES.base,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.medium,
            color: COLORS.primary,
          }}
        >
          {bid.itemDescription}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: SIZES.small ,
            color: COLORS.secondary,
            marginTop: 3,
          }}
        >
          {bid.itemID}
        </Text>
      </View>

    </View>
  );
};

export default DetailsBid;
