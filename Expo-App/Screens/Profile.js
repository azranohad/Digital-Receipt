import React, {useEffect, useState} from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native'
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { Value } from 'react-native-reanimated';


const ProfileScreen = (props) => {
            const [userKey, setuserKey] = useState('');
            const [username, setUsername] = useState('');
            const [name, setName] = useState('');
            const [lastname, setLastName] = useState('');
            const [phonenumber, setPhonenumber] = useState('');
            const [email, setEmail] = useState('');
            const [country, setCountry] = useState('');
            const [city, setCity] = useState('');
            const [id, setId] = useState('');
            const [age, setAge] = useState('');
            const [birthday, setBirthday] = useState('');
            const [error, setError] = useState('');
            const getData = async () => {
              try {
                const value = await AsyncStorage.getItem('userId')
                console.log("getdata: ",value);
                return value;

                if(value !== null) {
                  //console.log("getdata: ",value);
                }
              } catch(e) {
                // error reading value
              }
            }
            setuserKey(getData());

            const getTempData =  () => {
              try {
                const value = "12345";
                console.log("getdata: ",value);
                return value;

                if(value !== null) {
                  //console.log("getdata: ",value);
                }
              } catch(e) {
                // error reading value
              }
            }
            useEffect(() =>
            {
              
            fetch("http://192.168.0.111:5000/users_controller/get_user_data", {
          method: 'POST',
          body:JSON.stringify({"user_key": userKey}),
          headers: {
              'content-type': 'aplication/json',
          },
      }).then(res => res.json()).then(data => {
          //console.log("data: ", data);
          // let response = Object.values(data)[0];
          // console.log("res: ",response);
          if (data=="Incorrect username or password"){
              console.log("Incorrect username or password");
              setError(data);
          }
          else {

            console.log(data);

            if(data['username'] !== 'undefined') {
              setUsername(data['username']);
            }
            if(data['name'] !== 'undefined') {
              setName(data['name']);
            }
            if(data['lastname'] !== 'undefined') {
              setLastName(data['lastname']);
            }
            if(data['phonenumber'] !== 'undefined') {
              setPhonenumber(data['phonenumber']);
            }
            if(data['email'] !== 'undefined') {
              setEmail(data['email']);
            }
            if(data['country'] !== 'undefined') {
              setCountry(data['country']);
            }
            if(data['city'] !== 'undefined') {
              setCity(data['city']);
            }
            if(data['id'] !== 'undefined') {
              setId(data['id']);
            }
            if(data['age'] !== 'undefined') {
              setAge(data['age']);
            }
            if(data['birthday'] !== 'undefined') {
              setBirthday(data['birthday']);
            }
              //storeData(data.toString());
          }
          console.log("end");
      });

    },[])
      async function sendUpdateReq() {
        //console.log("getdata: ",value);
        await AsyncStorage.getItem('userId').then( response => {
          setuserKey(response);
          console.log(response);
        });
        console.log("userKey: ",userKey);

        //setuserKey(value)
        fetch("http://192.168.0.111:5000/users_controller/update_user", {
          method: 'POST',
          body:JSON.stringify({
            "user_key": userKey,
            "username": username,
            "name": name,
            "lastname": lastname,
            "age": age,
            "city": city,
            "country": country,
            "email": email,
            "phonenumber": phonenumber,
            "id": id,
            "birthdate": birthday
                  }),
          headers: {
              'content-type': 'aplication/json',
          },
      }).then(res => res.json()).then(data => {
          //console.log("data: ", data);
          // let response = Object.values(data)[0];
          // console.log("res: ",response);
          if (data=="Incorrect username or password"){
              console.log("Incorrect username or password");
              setError(data);
          }
          else {
               //let id = data['city'];
               //console.log(id);
               //setTempPassword(id);
              //storeData(data.toString());
          }
          console.log("end");
      });
      }
    return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <ScrollView>
                      <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                      <Text>Name: </Text>
                      <TextInput
                          value={name}
                          onChangeText={(lname) => setName(lname)}
                          placeholder={name}
                          style={styles.input}
                          />
                          </View>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <Text>Last Name: </Text>
                          <TextInput
                          value={lastname}
                          onChangeText={(name) => setLastName(name)}
                          placeholder={lastname}
                          style={styles.input}
                          />
                          </View>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <Text>Username: </Text>
                          <TextInput
                          value={username}
                          onChangeText={(username) => setUsername(username)}
                          placeholder={username}
                          style={styles.input}
                          />
                          </View>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <Text>Age: </Text>
                          <TextInput
                          value={age}
                          onChangeText={(lname) => setAge(lname)}
                          placeholder={age}
                          style={styles.input}
                          keyboardType={'number-pad'}
                          />
                          </View>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <Text>City: </Text>
                          <TextInput 
                          value={city}
                          onChangeText={(name) => setCity(name)}
                          placeholder={city}
                          style={styles.input}
                          />
                          </View>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <Text>Country: </Text>
                          <TextInput
                          value={country}
                          onChangeText={(name) => setCountry(name)}
                          placeholder={country}
                          style={styles.input}
                          />
                          </View>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <Text>Email: </Text>
                          <TextInput
                          value={email}
                          onChangeText={(pass) => setEmail(pass)}
                          placeholder={email}
                          style={styles.input}
                          keyboardType={'email-address'}
                          />
                          </View>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <Text>Phone Number:</Text>
                          <TextInput
                          value={phonenumber}
                          onChangeText={(pass) => setPhonenumber(pass)}
                          placeholder={phonenumber}
                          style={styles.input}
                          keyboardType={'number-pad'}
                          />
                          </View>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <Text>ID: </Text>
                          <TextInput
                          value={id}
                          onChangeText={(lname) => setId(lname)}
                          placeholder={id}
                          style={styles.input}
                          keyboardType={'number-pad'}
                          />
                          </View>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <Text>Day Of Birth: </Text>
                          <TextInput 
                          value={birthday}
                          onChangeText={(name) => setBirthday(name)}
                          placeholder={birthday}
                          style={styles.input}
                          />
                          </View>
                        <Button title="Submit" onPress={()=>sendUpdateReq() }/>
            </ScrollView>
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

export default ProfileScreen
