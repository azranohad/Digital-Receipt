import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native'
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { Loading } from "../components";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";



const HomeScreen = () => {
  const navigation = useNavigation();
  const uri = "https://firebasestorage.googleapis.com/v0/b/invertible-fin-335322.appspot.com/o/barcode.png?alt=media&token=3ece088e-8be9-4e4a-b6ed-869db0fe7ead"
    const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('userId')
          if(value !== null) {
            console.log("getdata: ",value);
          }
        } catch(e) {
          // error reading value
        }
      }
    return (
        <View style={{
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
        }}>
            <Text>Home Screen</Text>
            <Button onPress={()=>navigation.navigate("ScanedImage", {uri})}>ko</Button>
        </View>
    )
}
const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    width: '100%',
    aspectRatio: 1,
    zIndex: 1,
  }
});
export default HomeScreen
