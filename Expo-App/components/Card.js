import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image } from "react-native";

import { COLORS, SIZES, SHADOWS, assets } from "../constants";
import { SubInfo, Price, CardTitle } from "./SubInfo";
import { RectButton, CircleButton } from "./Button";


const Card = ({ data,handlePress, date, price, receipt}) => {
  const navigation = useNavigation();
  const uri = data.url_scan_image;

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
          source={assets.nft01}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderTopLeftRadius: SIZES.font,
            borderTopRightRadius: SIZES.font,
          }}
        />

        <CircleButton imgUrl={assets.trash} right={10} top={10} handlePress={handlePress}/>
      </View>

      <SubInfo date={date} receipt={receipt}/>

      <View style={{ width: "100%", padding: SIZES.font }}>
        <CardTitle
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
          <Price price={price.toFixed(2)} />
          <RectButton
            minWidth={80}
            fontSize={SIZES.font}
            handlePress={() => {
              if (receipt){
                data.is_digital_receipt ? navigation.navigate("DigitalReceipt", { data }): navigation.navigate("ScanedImage", {uri});
              }
              else {
                data.isDigitalCredit ? navigation.navigate("DigitalCredit", { data }): navigation.navigate("ScanedImage", {uri});
              }
            }}
            buttonText={"Show"}
          />
        </View>
      </View>
    </View>
  );
};

export default Card;
