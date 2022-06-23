import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet,
  TextInput,
  View,
  Text,
  SectionList,
  SafeAreaView,
  Image,
  Button,
  FlatList,} from "react-native";
import { Colors } from "react-native-paper";
import { DataTable } from 'react-native-paper';

import { COLORS, FONTS, SIZES, assets } from "../constants";
import { RectButton } from "react-native-gesture-handler";
import { CircleButton } from "./Button";
import { useNavigation } from "@react-navigation/native";

const HomeHeader = ({ data, onSelect, onSearch, filter, setFilter, Type, date, name, store, setStore, setName, setDate }) => {
  const [show, setShow] = useState(false);
  const [placeholder, setPlaceHolder] = useState('Search By Name..');
  const [searchByName, setSearchByName] = useState('');
const navigation = useNavigation();

const ListItem = ({ item, onSelect, setFilter }) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <View style={styles.item}>
      <TouchableOpacity
      style={{
        backgroundColor: isPressed? COLORS.primary: COLORS.gray,
        padding: SIZES.small,
        borderRadius: SIZES.extraLarge,
        minWidth: 100,
      }}
      onPress={()=>{setIsPressed(true); onSelect(item);setFilter(true);}}
    >
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: SIZES.large,
          color: COLORS.white,
          textAlign: "center",
        }}
      >
        {item}
      </Text>
    </TouchableOpacity>
    </View>
  );
};

  return (
//   <View
//   style={{
//     backgroundColor: COLORS.midnightblue, //primary
//     width: "100%",
//       height: "30%",
//     // padding: SIZES.font,
//     // paddingTop: 20,
//     // paddingLeft:50,
//     // paddingRight:50,
//     // paddingBottom:20,
//   }}
//   >

//     <CircleButton
//   imgUrl={assets.left}
//   handlePress={() => navigation.navigate({Type}, { data })}
//   right={25}
//   top={StatusBar.currentHeight}
//   padding={10}
// />
//   </View> 

  <View
  style={{
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
              onEndEditing={()=>{onSearch(searchByName); setSearchByName('');}}
              // onEndEditing={val=>setSearchByName(val)}
              onChangeText={(val)=>setSearchByName(val)}
              />
      {/* <TouchableOpacity onPress={()=>setShow(!show)}>
        <Image source={assets.search}></Image>
        </TouchableOpacity> */}

        
    </View>
      </View>
      {<FlatList
      horizontal
      data={Object.keys(data)}
      renderItem={({ item }) => <ListItem item={data[item]} onSelect={onSelect} setFilter={setFilter}  />}
      keyExtractor={( item ) =>item}
      showsHorizontalScrollIndicator={false}
      />}
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  sectionHeader: {
    fontWeight: '800',
    fontSize: 18,
    color: '#f4f4f4',
    marginTop: 20,
    marginBottom: 5,
  },
  item: {
    marginLeft: 5,
    marginTop: 15,
  },
  itemPhoto: {
    width: 200,
    height: 200,
  },
  itemText: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 5,
  },
});
export default HomeHeader;
