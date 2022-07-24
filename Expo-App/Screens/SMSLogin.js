import React, {useState} from 'react';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { View, Text,Button, ImageBackground, Image,TextInput, SafeAreaView, StyleSheet } from 'react-native';
import GpsScreen from './Gps';
import {useNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { Card, SearchBar, FocusedStatusBar ,RectButton} from "../components";

const SMSLoginScreen = ( {route}) => {
    const [phoneNumber, setUsername] = useState('');
    const [isPhoneNumsent, setPhoneNum] = useState(false);
    const [isTempPasswordsent, setTempPasswordsent] = useState(false);
    const [isPasswordVerified, setPasswordVerified] = useState(true);
    const [isPassword, setPassword] = useState(false);
    const [tempPassword, setTempPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();
    const url = "192.168.0.111";

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
        fetch(`http://${route.params.url}/users_controller/send_smsCode_to_verify`, {
            method: 'POST',
            body:JSON.stringify({"phone_number": phoneNumber}),
            headers: {
                'content-type': 'aplication/json',
            //    "phone_number": phoneNumber,
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
        //setTempPasswordsent(true)
        fetch(`http://${route.params.url}/users_controller/verify_sms_code`, {
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
                //setError(data);
            }
            else {
                // let id = Object.values(data)[0];
                storeData(data.toString());
                //setPasswordVerified(true);
                setPhoneNum(false);
                navigation.navigate('Home');
            }
            console.log("end");
        });
    }

    return (
        isPhoneNumsent ? isPassword? <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop:100}}>
            <SafeAreaView style={{ flex: 1 }}>
                <View >
                {isPassword ?<Text>Verified!!!</Text> : <Text>Incorrect username or password</Text>} 
                    
                    {/* <TextInput 
                    value={tempPassword}
                    onChangeText={(tempPassword) => setTempPassword(tempPassword)}
                    placeholder={'Temp Password'}
                    style={styles.input}
                    />
                     <Button title="Send" onPress={()=>sendTempPassword() }/> */}

                </View>
            </SafeAreaView>
        </View> : <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop:100}}>
            <SafeAreaView style={{ flex: 1 }}>
                <View >
                <View style={styles.imagecontainer}>
                <Image style={{width:100,height: 100}} source={require('../assets/icon.png')} />
                </View >
                <Text style={styles.textcontainer2}>✔ SMS sent </Text>
                {isPasswordVerified ?<Text></Text> : <Text>Password Worng!!! Please try again</Text>} 
                    <TextInput 
                    value={tempPassword}
                    onChangeText={(tempPassword) => setTempPassword(tempPassword)}
                    placeholder={'Temp Password'}
                    secureTextEntry={true}
                    style={styles.input}

                    />
                     {/* <Button title="Send" onPress={()=>sendTempPassword() }/> */}
                     <RectButton marginTop={10} minWidth={170} fontSize={SIZES.large} {...SHADOWS.light} buttonText={"Send"} handlePress={()=>sendTempPassword()}/>

                </View>
            </SafeAreaView>
        </View> : <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop:100}}>
            <SafeAreaView style={{ flex: 1 }}>
                <View >
                <View style={styles.imagecontainer}>
                <Image style={{width:100,height: 100}} source={require('../assets/icon.png')} />
                </View >
                    <TextInput 
                    value={phoneNumber}
                    onChangeText={(phoneNumber) => setUsername(phoneNumber)}
                    placeholder={'Phone Number'}
                    style={styles.input}
                    keyboardType={'number-pad'}
                    />
                     {/* <Button title="Send" onPress={()=>sendDetails() }/> */}
                     <RectButton marginTop={10} minWidth={170} fontSize={SIZES.large} {...SHADOWS.light} buttonText={"Send"} handlePress={()=>sendDetails() }/>

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
//   input: {
//     width: 250,
//     height: 44,
//     padding: 10,
//     marginTop: 20,
//     marginBottom: 10,
//     backgroundColor: '#e8e8e8'
//   },
  imagecontainer: {
    
    //flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',

    marginTop: 0,
    //backgroundColor: '#ffffff',
  },
  input: {
    width: 350,
    fontStyle: 'normal',

    height: 44,
    padding: 10,
    borderRadius: 10,
    borderWidth:1,
    borderColor:'#dcdcdc',
    marginTop: 70,
    marginBottom: 20,
    //backgroundColor: '#e8e8e8'
  },
  input2: {
    width: 350,
    borderRadius: 10,
    height: 44,
    padding: 10,
    borderWidth:1,
    borderColor:'#dcdcdc',
    marginTop: 0,
    marginBottom: 50,
    //backgroundColor: '#e8e8e8'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginBottom: 20,
    shadowColor:'white',
    backgroundColor: 'white',
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
    shadowColor:'white',
    backgroundColor: COLORS.midnightblue,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  text1: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  textcontainer2: {
    fontWeight: 'bold',
    width: 350,
    fontStyle: 'normal',
    textAlign: 'center',
    alignItems:'center',
    height: 50,
    padding: 0,
    borderRadius: 1,
    //borderWidth:1,
    borderColor:'#dcdcdc',
    marginTop: 50,
    marginBottom: 0,
    backgroundColor: COLORS.white,
    color: 'black',
    fontSize: 24,


  },
});

export default SMSLoginScreen
