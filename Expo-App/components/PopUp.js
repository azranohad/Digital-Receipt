import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image , Text, ImageBackgroundBase} from "react-native";

import { COLORS, SIZES, SHADOWS, assets } from "../constants";
import { SubInfo, EthPrice, NFTTitle } from "./SubInfo";
import { RectButton, CircleButton } from "./Button";

//{ data,handlePress, date, price, receipt}
export const PopUp = () =>{

  return (
      <View
        style={{
          backgroundColor: COLORS.gray,
          borderRadius: SIZES.base,
          borderTopLeftRadius: SIZES.font,
          borderTopRightRadius: SIZES.font,
          width: "50%",
          height: "50%",
        }}
      >
                 {/* alignItems: "center",
          borderTopLeftRadius: SIZES.font,
         borderTopRightRadius: SIZES.font,
         alignItems:"center",
         justifyContent: "center", */}
        {/* <Image
          source={assets.nft01}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderTopLeftRadius: SIZES.font,
            borderTopRightRadius: SIZES.font,
          }}
        />

      </View>

      <SubInfo date={date} receipt={receipt}/>

      <View style={{ width: "100%", padding: SIZES.font }}>
        <NFTTitle
          title={data.name_for_client}
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
          <EthPrice price={price.toFixed(2)} />
          <RectButton
            minWidth={80}
            fontSize={SIZES.font}
            handlePress={() => navigation.navigate("DigitalReceipt", { data })}
            buttonText={"Show"}
          />
        </View> */}
      </View>
  );
};

