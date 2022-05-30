import React from 'react'
import { View, Text } from 'react-native'
import  AsyncStorage  from '@react-native-async-storage/async-storage';


const SettingsScreen = () => {
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
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text>This is Settings Screen</Text>
        </View>
    )
}

export default SettingsScreen
