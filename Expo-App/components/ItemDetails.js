import React from "react";
import { View, Text } from "react-native";

import { Price } from "./SubInfo";
import { COLORS, SIZES, FONTS } from "../constants";

const ItemDetails = ({ item }) => {
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
      key={item._id}
    >
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
        }}
        >
        x{item.amount}
      </Text>
      <Price price={item.price} />
      </View>
      <View
        style={{
          flex: 1,
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
          {item.itemDescription}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: SIZES.small ,
            color: COLORS.secondary,
            marginTop: 3,
          }}
        >
          {item.itemID}
        </Text>
      </View>
    </View>
  );
};

export default ItemDetails;
