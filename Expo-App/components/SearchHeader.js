import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet,
  TextInput,
  View,
  Text,
  SectionList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Button,
  FlatList,} from "react-native";
import { Colors } from "react-native-paper";
import { DataTable } from 'react-native-paper';

import { COLORS, FONTS, SIZES, assets } from "../constants";
import { RectButton } from "react-native-gesture-handler";
import { CircleButton } from "./Button";
import { useNavigation } from "@react-navigation/native";

const SearchHeader = ({ handleSearch, setSearchByName, searchByName}) => {
    const [placeholder, setPlaceHolder] = useState("Search Store..");
    return(
    <View style={{
            backgroundColor: COLORS.primary, //primary
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
                <TouchableOpacity >
                    <Image
                    source={assets.search}
                    resizeMode="contain"
                    style={{ width: 20, height: 20, marginRight: SIZES.base }}
                    />
                </TouchableOpacity>
                    <TextInput
                    placeholder={placeholder}
                    style={{ flex: 1 }}
                    onEndEditing={()=>{handleSearch(searchByName); setPlaceHolder("Search Store..");}}
                    // onEndEditing={val=>setSearchByName(val)}
                    onChangeText={(val)=>setSearchByName(val)}
                    />

              
                      
            </View>
        </View>
    </View>);

}

export default SearchHeader;