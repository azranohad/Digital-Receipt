import React, {useState} from 'react'
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { View, Text, ImageBackground, Button, TextInput, SafeAreaView, StyleSheet } from 'react-native'


const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
        fetch("http://192.168.43.254:3000/login", {
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
                    <TextInput
                    value={username}
                    onChangeText={(username) => setUsername(username)}
                    placeholder={'UserName'}
                    style={styles.input}
                    />
                    <TextInput
                    value={password}
                    onChangeText={(pass) => setPassword(pass)}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    style={styles.input}
                    />
                     <Button title="Submit" onPress={()=>sendDetails()}/>
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
