import React, {useState} from 'react';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { View, Text,Button, ImageBackground, TextInput, SafeAreaView, StyleSheet } from 'react-native';
import GpsScreen from './Gps';
import {useNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';



const LoginScreen = () => {
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
        fetch(`http://${props.url}/users_controller/login_user_name_and_password`, {
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
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <SafeAreaView style={{ flex: 1 }}>
                <View >
                <View>

                    <TextInput
                    value={username}
                    onChangeText={(username) => setUsername(username)}
                    placeholder={'UserName'}
                    style={styles.input}
                    />
                    </View>
                    <TextInput
                    value={password}
                    onChangeText={(pass) => setPassword(pass)}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    style={styles.input}
                    />

                     <Button title="Submit" onPress={()=>sendDetails()}/>

                     <Button title="Login via SMS" onPress={()=>navigation.navigate('SMSLogin')}/>
                     <Button title="Don't have account? Sign up" onPress={()=>navigation.navigate('Sign Up')}/>

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


export default LoginScreen
