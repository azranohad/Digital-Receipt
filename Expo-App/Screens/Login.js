import React, {useState} from 'react';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { View, Text,Button,Pressable,Image, ImageBackground, TextInput, SafeAreaView, StyleSheet } from 'react-native';
import GpsScreen from './Gps';
import {useNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { NFTCard, HomeHeader, FocusedStatusBar ,RectButton} from "../components";



const LoginScreen = ({ route}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
        fetch(`http://${route.params.url}/users_controller/login_user_name_and_password`, {
            method: 'POST',
            body:JSON.stringify({"username": username, "password": password}),
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
                storeData(data.toString());
            }
            console.log("end");
        });
    }

    return (
        <View style={{flex:2, alignItems:'center',position:'relative', marginTop: 10, top: 0,bottom: 0,right: 0,left: 0,
        zIndex: -1, justifyContent:'center' ,height: '50%'}}  >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{height: '50%'}}>
                <View style={styles.imagecontainer}>
                <Image style={{width:100,height: 100}} source={require('../assets/icon.png')} />
                </View >
                <View>

                    <TextInput 
                    value={username}
                    onChangeText={(username) => setUsername(username)}
                    placeholder={'User Name'}
                    style={styles.input}
                    />
                    </View >
                    <TextInput 
                    value={password}
                    onChangeText={(pass) => setPassword(pass)}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    style={styles.input2}
                    />
                     <View>
                        {/* <Button style={styles.button}  title="Login" onPress={()=>sendDetails()}/> */}
                     
                     {/* <Pressable style={styles.button1} onPress={()=>sendDetails()}>
                         <Text style={styles.text1}>Login</Text>
                    </Pressable> */}
                    <RectButton marginTop={10} minWidth={170} fontSize={SIZES.large} {...SHADOWS.light} buttonText={"Sign in"} handlePress={()=>sendDetails()}/>

                    </View>
                    <View>
                    {/* <Pressable style={styles.button1} onPress={()=>navigation.navigate('SMSLogin')}>
                         <Text style={styles.text1}>Login via SMS</Text>
                    </Pressable> */}

                    <RectButton marginTop={10} minWidth={170} fontSize={SIZES.large} {...SHADOWS.light} buttonText={"Login via SMS"} handlePress={()=>navigation.navigate('SMSLogin')}/>
                     {/* <Button style={{marginVertical: 8}} title="Login via SMS" onPress={()=>navigation.navigate('SMSLogin')}/> */}
                     </View>

                     <View style={{marginVertical: 8}}>
                     <Pressable style={styles.button} onPress={()=>navigation.navigate('Sign Up')}>
                         <Text style={styles.text}>Don't have account? Sign up</Text>
                    </Pressable> 
                     {/* <Button style={{marginVertical: 8}} title="Don't have account? Sign up" onPress={()=>navigation.navigate('Sign Up')}/> */}
                     </View>

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
  imagecontainer: {
    
    //flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',

    marginTop: 20,
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
});


export default LoginScreen
