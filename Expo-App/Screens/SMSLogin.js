import React, {useState} from 'react';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { View, Text,Button, ImageBackground, TextInput, SafeAreaView, StyleSheet } from 'react-native';
import GpsScreen from './Gps';
import {useNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const SMSLoginScreen = ( props) => {
    const [phoneNumber, setUsername] = useState('');
    const [isPhoneNumsent, setPhoneNum] = useState(false);
    const [isTempPasswordsent, setTempPasswordsent] = useState(false);
    const [isPasswordVerified, setPasswordVerified] = useState();
    const [tempPassword, setTempPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const storeData = async (value) => {
        try {
            console.log(typeof(value));
            console.log(value);
          await AsyncStorage.setItem('userId', value)
          console.log("here");
        } catch (e) {
          // saving error
          console.log(e);

        }
      }
     
    async function sendDetails() {
        setPhoneNum(true)
        fetch(`http://${props.url}/users_controller/send_smsCode_to_verify`, {
            method: 'POST',
            body:JSON.stringify({"phone_number": phoneNumber}),
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
    }
    async function sendTempPassword() {
        setTempPasswordsent(true)
        fetch(`http://${props.url}/users_controller/verify_sms_code`, {
            method: 'POST',
            body:JSON.stringify({"phone_number": phoneNumber, "temp_password": tempPassword}),
            headers: {
                'content-type': 'aplication/json',
            },
        }).then(res => res.text()).then(data => {
            console.log("data: ", data);
            // let response = Object.values(data)[0];
            // console.log("res: ",response);
            if (data=="The code is wrong"){
                console.log("Incorrect password");
                setPasswordVerified(false);
                setError(data);
            }
            else {
                // let id = Object.values(data)[0];
                storeData(data.toString());
                setPasswordVerified(true);
            }
            console.log("end");
        });
    }

    return (
        isPhoneNumsent ? isTempPasswordsent? <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <SafeAreaView style={{ flex: 1 }}>
                <View >
                {isPasswordVerified ?<Text>Verified!!!</Text> : <Text>Incorrect username or password</Text>} 
                    
                    {/* <TextInput 
                    value={tempPassword}
                    onChangeText={(tempPassword) => setTempPassword(tempPassword)}
                    placeholder={'Temp Password'}
                    style={styles.input}
                    />
                     <Button title="Send" onPress={()=>sendTempPassword() }/> */}

                </View>
            </SafeAreaView>
        </View> : <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <SafeAreaView style={{ flex: 1 }}>
                <View >
                <Text>SMS send to: {phoneNumber}</Text>
                    <TextInput 
                    value={tempPassword}
                    onChangeText={(tempPassword) => setTempPassword(tempPassword)}
                    placeholder={'Temp Password'}
                    style={styles.input}
                    />
                     <Button title="Send" onPress={()=>sendTempPassword() }/>

                </View>
            </SafeAreaView>
        </View> : <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <SafeAreaView style={{ flex: 1 }}>
                <View >

                    <TextInput 
                    value={phoneNumber}
                    onChangeText={(phoneNumber) => setUsername(phoneNumber)}
                    placeholder={'Phone Number'}
                    style={styles.input}
                    />
                     <Button title="Send" onPress={()=>sendDetails() }/>

                </View>
            </SafeAreaView>
        </View>
    )
}

const sendSMSView = ()=> {
    return(
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <SafeAreaView style={{ flex: 1 }}>
            <View >
                
                <TextInput 
                value={phoneNumber}
                onChangeText={(phoneNumber) => setUsername(phoneNumber)}
                placeholder={Passwordsent? 'Temp Password':'Phone Number'}
                style={styles.input}
                />
                 <Button title="Submit" onPress={()=>sendDetails() }/>

            </View>
        </SafeAreaView>
    </View>
    )
}
const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#ffffff',
  },
  input: {
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e8e8e8'
  },
});

export default SMSLoginScreen
