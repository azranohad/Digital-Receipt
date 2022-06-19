import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image } from "react-native";

import { COLORS, SIZES, SHADOWS, assets } from "../constants";
import { SubInfo, EthPrice, NFTTitle } from "./SubInfo";
import { RectButton, CircleButton } from "./Button";

const ProductCard = ({ data}) => {
  const navigation = useNavigation();

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
          height: 30,
        }}
      >
        <Image
        source = {data.image}
         // source={assets.nft01}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderTopLeftRadius: SIZES.font,
            borderTopRightRadius: SIZES.font,
          }}
        />

        {/* <CircleButton imgUrl={assets.trash} right={10} top={10} handlePress={handlePress}/> */}
      </View>

      {/* <SubInfo date={data.date_of_receipt}/> */}

      <View style={{ width: "100%", padding: SIZES.font }}>
        <NFTTitle
          title={data.name}
          subTitle={data.market}
          titleSize={SIZES.large}
          subTitleSize={SIZES.small}
        />

        <View
          style={{
            marginTop: SIZES.font,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <EthPrice price={data.total_price.toFixed(2)} />
          <RectButton
            minWidth={120}
            fontSize={SIZES.font}
            handlePress={data.reference}
            buttonText={"Shop"}
          />
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
