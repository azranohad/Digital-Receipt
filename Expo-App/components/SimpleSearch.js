import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Image, TextInput } from "react-native";
import { Colors } from "react-native-paper";
import { DataTable } from 'react-native-paper';

import { COLORS, FONTS, SIZES, assets } from "../constants";

const SimpleSearch = ({ handleSearch }) => {
  const [search, setSearch] = useState('');


  return (
    <View
      style={{
        backgroundColor: COLORS.midnightblue, //primary
        padding: SIZES.font,
        paddingTop: 20,
        paddingLeft:50,
        paddingRight:50,
        paddingBottom:20,
      }}
    >

      <View style={{ marginTop: SIZES.font }}>
        <View
          style={{
            width: "100%",
            borderRadius: 30,
            backgroundColor: COLORS.lightgray,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: SIZES.font,
            paddingVertical: SIZES.small - 2,
          }}
        >
          <TouchableOpacity onPress={()=>{handleSearch(search)}} >
            <Image
              source={assets.search}
              resizeMode="contain"
              style={{ width: 20, height: 20, marginRight: SIZES.base }}
              />
          </TouchableOpacity>
            <TextInput
              placeholder="Search Store"
              style={{ flex: 1 }}
              onChangeText={val=>setSearch(val)}
              />
      
    </View>
      </View>
        </View>
  );
};

export default SimpleSearch;
