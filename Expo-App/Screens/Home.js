import React from 'react'
import { View, Text } from 'react-native'
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const HomeScreen = (navigation) => {
    return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text>This is my Home Screen</Text>
        </View>
    )
}

export default HomeScreen
