import React from 'react'
import { View, Text } from 'react-native'
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { Value } from 'react-native-reanimated';


const ProfileScreen = () => {
            const getData = async () => {
              try {
                const value = await AsyncStorage.getItem('userId')
                console.log("getdata: ",value);

                if(value !== null) {
                  //console.log("getdata: ",value);
                  return value;
                }
              } catch(e) {
                // error reading value
              }
            }
             const userKey = getData();
            
            fetch("http://192.168.0.111:5000//users_controller/verify_sms_code", {
            method: 'POST',
            body:JSON.stringify({"user_key": userKey}),
            headers: {
                'content-type': 'aplication/json',
            },
        }).then(res => res.text()).then(data => {
            console.log("data: ", data);
            // let response = Object.values(data)[0];
            // console.log("res: ",response);
            if (data=="Incorrect username or password"){
                console.log("Incorrect username or password");
                setError(data);
            }
            else {
                // let id = Object.values(data)[0];
                //storeData(data.toString());
            }
            console.log("end");
        });


      async function getDetails() {
      }
    return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text>jghj</Text>
        </View>
    )
}

export default ProfileScreen
