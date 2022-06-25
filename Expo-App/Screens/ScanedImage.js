import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image, StatusBar, FlatList, StyleSheet } from "react-native";
import {useNavigation} from '@react-navigation/native'
import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { CircleButton, RectButton, SubInfo, DetailsDesc, DetailsBid, FocusedStatusBar,Loading } from "../components";
import {firebase} from '../firebase'

const Header = ({navigation }) => (
  <View style={{ width: "100%", height: 80 }}>
    <CircleButton
      imgUrl={assets.left}
      handlePress={() => {navigation.navigate("Receipts")}}
      right={10}
      top={10}
    />
  </View>
  
);

const ScanedImage= ({ route}) => {
  // const { data } = route.params;
  const { uri } = route.params;
  const [image , setImage] = useState(null)
  const navigation = useNavigation();


  // useEffect(()=> {getBarcode(data.filename);})
  useEffect(()=> {
     setImage(uri);
  })


  
  return (
    image ? <>
    <Header navigation={navigation}/>
    <Image style={{height:'100%', width:'100%'}} resizeMode='contain' source={{ uri: image }}/>
    {/* <Image style={{height:'100%', width:'100%'}} resizeMode='contain' source={{ uri: data.url_scan_image }}/> */}
    </>:
    <Loading/>
  );
};



export default ScanedImage;
