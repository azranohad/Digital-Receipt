import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet,TextInput,View,Text,TouchableOpacity,Image,FlatList,} from "react-native";
import { ScreenStackHeaderBackButtonImage } from "react-native-screens";
import { COLORS, FONTS, SIZES, assets } from "../constants";
import { CircleButton } from "./Button";

const SearchBar = ({ data, onSelect, onSearch, filter, setFilter, searchByName, setSearchByName, original, setJsonData, placeholder, storesFilter }) => {
    const [pressedName, setPressedName] = useState('All')
const ListItem = ({ item, onSelect, setPressedName, pressedName}) => {
  return (
    <View style={styles.item}>
      <TouchableOpacity
      style={{
        backgroundColor: pressedName==item ? COLORS.lightgray: COLORS.gray,
        padding: SIZES.small,
        borderRadius: SIZES.extraLarge,
        minWidth: 100,
      }}
      onPress={()=>{setPressedName(item); if (item!='All'){
        onSelect(item);
      }
    else {
      setJsonData(original);
    }}}
    >
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: SIZES.large,
          color: pressedName==item ? COLORS.primary: COLORS.white,
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
  <View
  style={{
    backgroundColor: COLORS.primary, 
    padding: SIZES.font,
    paddingTop: 20,
    paddingLeft:50,
    paddingRight:50,
    paddingBottom:20,
  }}
  >{storesFilter &&<>
  {filter && <CircleButton
imgUrl={assets.left}
handlePress={() => {setFilter(false); setJsonData(original); setSearchByName(''); setPressedName('All')}}
right={SIZES.rightHeight}
top={63}
/>}
      
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
              value={searchByName}
              onEndEditing={()=>{if (searchByName!=""){onSearch(searchByName);  setJsonData([]); };}}
              onChangeText={(val)=>setSearchByName(val)}
              />
  

        
    </View>
      </View>
      </>}
       <FlatList
      horizontal
      data={Object.keys(data)}
      renderItem={({ item }) => <ListItem item={data[item]} onSelect={onSelect} pressedName={pressedName} setPressedName={setPressedName}/>}
      keyExtractor={( item ) =>item}
      showsHorizontalScrollIndicator={false}
      />
      </View>
  );
};


const styles = StyleSheet.create({
  item: {
    marginLeft: 5,
    marginTop: 15,
  },
});
export default SearchBar;
