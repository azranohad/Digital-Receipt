import React, { useState } from "react";
import { StyleSheet,TextInput,View,Text,TouchableOpacity,Image,FlatList,} from "react-native";
import { COLORS, FONTS, SIZES, assets } from "../constants";
import { CircleButton } from "./Button";

const SearchBar = ({ data, onSelect, onSearch, filter, setFilter, searchByName, setSearchByName, original, setAll, setJsonData, placeholder, storesFilter }) => {
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
      onPress={()=>{setIsPressed(true);setJsonData([]); onSelect(item);setFilter(true); }}
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
  <View
  style={{
    backgroundColor: COLORS.primary, 
    padding: SIZES.font,
    paddingTop: 20,
    paddingLeft:50,
    paddingRight:50,
    paddingBottom:20,
  }}
  >
  {filter && <CircleButton
imgUrl={assets.left}
handlePress={() => {setFilter(false); setJsonData(original);}}
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
              onEndEditing={()=>{if (searchByName!=""){onSearch(searchByName); setSearchByName('');}}}
              onChangeText={(val)=>setSearchByName(val)}
              />
  

        
    </View>
      </View>
      {storesFilter && <FlatList
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
  item: {
    marginLeft: 5,
    marginTop: 15,
  },
});
export default SearchBar;
