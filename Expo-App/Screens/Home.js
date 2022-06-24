import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native'
import  AsyncStorage  from '@react-native-async-storage/async-storage';



const HomeScreen = () => {

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
