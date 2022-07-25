import React, {useEffect, useState} from 'react';
import { View, Text, Button,Image, TextInput, StyleSheet, ScrollView } from 'react-native'
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { Value } from 'react-native-reanimated';
import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { Card, SearchBar, FocusedStatusBar ,RectButton} from "../components";

const ProfileScreen = ({route}) => {
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
            const url = route.params.url;
            const getData = async () => {
              try {
                const value = await AsyncStorage.getItem('userId')
                setuserKey(value);
                console.log("getdata: ",value);
                return value;

                if(value !== null) {
                  //console.log("getdata: ",value);
                }
              } catch(e) {
                // error reading value
              }
            }
            const user_key = getData();
            const getTempData =  () => {
              try {
                const value = "12345";
                console.log("getdata: ",value);
                return value;

                if(value !== null) {
                }
              } catch(e) {
                // error reading value
              }
            }
            
            useEffect(() =>
            {
               getData().then(res => setuserKey(res)).then(res => fetch(`http://${url}/users_controller/get_user_data`, {
          method: 'GET',
          headers: {
              'content-type': 'aplication/json',
              "user_key": "33310727751848c19a8877140d3ce3ac",
          },
      })).then(res => res.json()).then(data => {

          if (data=="Incorrect username or password"){
              console.log("Incorrect username or password");
              setError(data);
          }
          else {

            console.log(data);

            if(data['private_name'] !== 'undefined') {
              setName(data['private_name']);
            }
            if(data['family_name'] !== 'undefined') {
              setLastName(data['family_name']);
            }
            if(data['phone_number'] !== 'undefined') {
              setPhonenumber(data['phone_number']);
            }
            if(data['age'] !== 'undefined') {
              setAge(String(data['age']));
            }
          }
          console.log("end");
      });

    },[])
      async function sendUpdateReq() {
        await AsyncStorage.getItem('userId').then( response => {
          setuserKey(response);
          console.log(response);
        });
        console.log("userKey: ",userKey);

        fetch(`http://${url}/users_controller/update_user`, {
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
      }).then(data => {

          // if (data=="Incorrect username or password"){
          //     console.log("Incorrect username or password");
          //     setError(data);
          // }
          // else {
          //     //  let id = data['city'];
          //     //  console.log(id);

          // }
          console.log("end");
      });
      }
    return (
      <ScrollView>

        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                          <View style={styles.imagecontainer}>
                              <Image style={{width:100,height: 100}} source={require('../assets/icon.png')} />
                          </View >
                          <Text style={styles.textcontainer2}>
                              <Text>My Account</Text>
                          </Text>
                          <Text style={styles.textcontainer}>
                              <Text>Name:</Text>
                          </Text>
                      <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                      <TextInput
                          value={name}
                          onChangeText={(lname) => setName(lname)}
                          placeholder={name}
                          style={styles.input}
                          />
                          </View>
                          <Text style={styles.textcontainer}>
                              <Text>Last Name:</Text>
                          </Text>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <TextInput
                          value={lastname}
                          onChangeText={(name) => setLastName(name)}
                          placeholder={lastname}
                          style={styles.input}
                          />
                          </View>
                          <Text style={styles.textcontainer}>
                              <Text>Username: </Text>
                          </Text>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <TextInput
                          value={username}
                          onChangeText={(username) => setUsername(username)}
                          placeholder={username}
                          style={styles.input}
                          />
                          </View>
                          <Text style={styles.textcontainer}>
                              <Text>Age:  </Text>
                          </Text>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <TextInput
                          value={age}
                          onChangeText={(lname) => setAge(lname)}
                          placeholder={age}
                          style={styles.input}
                          keyboardType={'number-pad'}
                          />
                          </View>
                          <Text style={styles.textcontainer}>
                              <Text>City: </Text>
                          </Text>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <TextInput 
                          value={city}
                          onChangeText={(name) => setCity(name)}
                          placeholder={city}
                          style={styles.input}
                          />
                          </View>
                          <Text style={styles.textcontainer}>
                              <Text>Country: </Text>
                          </Text>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <TextInput
                          value={country}
                          onChangeText={(name) => setCountry(name)}
                          placeholder={country}
                          style={styles.input}
                          />

                          </View>
                          <Text style={styles.textcontainer}>
                              <Text>Email: </Text>
                          </Text>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          <TextInput
                          value={email}
                          onChangeText={(pass) => setEmail(pass)}
                          placeholder={email}
                          style={styles.input}
                          keyboardType={'email-address'}
                          />
                          </View>
                          <Text style={styles.textcontainer}>
                              <Text>Phone Number:*</Text>
                          </Text>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          {/* <Text>Phone Number:</Text> */}
                          <TextInput
                          value={phonenumber}
                          onChangeText={(pass) => setPhonenumber(pass)}
                          placeholder={phonenumber}
                          style={styles.input}
                          keyboardType={'number-pad'}
                          />
                          </View>
                          <Text style={styles.textcontainer}>
                              <Text>ID:</Text>
                          </Text>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          {/* <Text>ID: </Text> */}
                          <TextInput
                          value={id}
                          onChangeText={(lname) => setId(lname)}
                          placeholder={id}
                          style={styles.input}
                          keyboardType={'number-pad'}
                          />
                          </View>
                          <Text style={styles.textcontainer}>
                              <Text>Day Of Birth:</Text>
                          </Text>
                          <View style={{flexDirection:'row',flex:1,alignItems:'center', justifyContent:'center'}}>
                          {/* <Text >Day Of Birth: </Text> */}
                          <TextInput 
                          value={birthday}
                          onChangeText={(name) => setBirthday(name)}
                          placeholder={birthday}
                          style={styles.input}
                          />
                          </View>
                        
                        <View>
                            <RectButton marginTop={10} minWidth={170} fontSize={SIZES.large} {...SHADOWS.light} buttonText={"Update"} handlePress={()=>sendUpdateReq() }/>
                         </View>
            
        </View>
        </ScrollView>
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
  
      marginTop: 50,
      //backgroundColor: '#ffffff',
    },
    input1: {
      width: 250,
      height: 44,
      padding: 10,
      marginTop: 20,
      marginBottom: 10,
      backgroundColor: '#e8e8e8'
    },
    input: {
      width: 350,
      fontStyle: 'normal',
      textAlign: 'left',
      height: 44,
      padding: 10,
      borderRadius: 10,
      borderWidth:1,
      borderColor:'#dcdcdc',
      marginTop: 10,
      marginBottom: 10,
      //backgroundColor: '#e8e8e8'
    },
    textcontainer: {
      fontWeight: 'bold',
      width: 350,
      fontStyle: 'normal',
      textAlign: 'right',
      alignItems:'center',
      padding: 0,
      borderRadius: 1,
      //borderWidth:1,
      borderColor:'#dcdcdc',
      marginTop: 10,
      marginBottom: 0,
      backgroundColor: COLORS.white,
      color: 'black',
      fontSize: 16,


    },
    textcontainer2: {
      fontWeight: 'bold',
      width: 350,
      fontStyle: 'normal',
      textAlign: 'right',
      alignItems:'center',
      height: 70,
      padding: 0,
      borderRadius: 1,
      //borderWidth:1,
      borderColor:'#dcdcdc',
      marginTop: 40,
      marginBottom: 10,
      backgroundColor: COLORS.white,
      color: 'black',
      fontSize: 32,


    },
  });

export default ProfileScreen
