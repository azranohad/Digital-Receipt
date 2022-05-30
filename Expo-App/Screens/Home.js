import React from 'react'
import { View, Text } from 'react-native'
import  AsyncStorage  from '@react-native-async-storage/async-storage';


const HomeScreen = () => {
    return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text>This is my Home Screen</Text>
        </View>
    )
}

export default HomeScreen
