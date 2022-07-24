import React from "react";
import { View, Image, Text, Linking } from "react-native";

import { COLORS, SIZES, SHADOWS, FONTS } from "../constants";
import { Price, CardTitle } from "./SubInfo";
import { RectButton } from "./Button";

const ProductCard = ({ data}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: SIZES.font,
        marginBottom: SIZES.extraLarge,
        margin: SIZES.base,
        ...SHADOWS.dark,
      }}
    >
      <View 
        style={{
          width: "100%",
          height: 250,
        }}
      >
        <Image
        source = {{uri: data.url_image}}
          resizeMode="contain"
          style={{
            width: "100%",
            height: "100%",
          }}
        />

      </View>


      <View style={{ width: "100%", padding: SIZES.font }} >
        <CardTitle
          title={data.itemDescription}
          subTitle={data.brand}
          titleSize={SIZES.large}
          subTitleSize={SIZES.medium}
        />
        <Text  style={{
          fontFamily: FONTS.semiBold,
          fontSize: SIZES.small,
          color: COLORS.primary,
        }}>{data.market}</Text>

        <View
          style={{
            marginTop: SIZES.font,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Price price={data.price} />
          <RectButton
            minWidth={120}
            fontSize={SIZES.font}
            handlePress={() => Linking.openURL(data.link_to_item)}
            buttonText={"Shop"}
          />
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
