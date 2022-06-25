import React, {useState} from 'react'
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { View, Text, ImageBackground,Image, Button,Pressable, TextInput, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import { color } from 'react-native-reanimated';
import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { NFTCard, HomeHeader, FocusedStatusBar ,RectButton} from "../components";
// import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
// import DatePicker from 'react-native-datepicker';

const SignupScreen = ({navigation, route}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
    
    const storeData = async (value) => {
        try {
          console.log(typeof(value));
          console.log(value);
          await AsyncStorage.setItem('userId', value)
        } catch (e) {
          // saving error
          console.log(e);

        }
      }
    
      // const datePicker = () => {
      // return (<DatePicker
      //     style={styles.datePickerStyle}
      //     date={birthday}
      //     mode="date"
      //     placeholder="select date"
      //     format="DD/MM/YYYY"
      //     minDate="01-01-1900"
      //     maxDate="01-01-2000"
      //     confirmBtnText="Confirm"
      //     cancelBtnText="Cancel"
      //   //   customStyles={{
      //   //     dateIcon: {
      //   //       position: 'absolute',
      //   //       right: -5,
      //   //       top: 4,
      //   //       marginLeft: 0,
      //   //     },
      //   //     dateInput: {
      //   //       borderColor : "gray",
      //   //       alignItems: "flex-start",
      //   //       borderWidth: 0,
      //   //       borderBottomWidth: 1,
      //   //     },
      //   //     placeholderText: {
      //   //       fontSize: 17,
      //   //       color: "gray"
      //   //     },
      //   //     dateText: {
      //   //       fontSize: 17,
      //   //     }
      //   //   }}
      //     onDateChange={(birthday) => {
      //       setBirthday(birthday);
      //     }}
      //   />
      // )};
      
    async function sendDetails() {
        if(username === '') {
            alert('Please Enter user name');
            return;
        } else if (password === '') {
            alert('Please Enter Password');
             return;
         } else if (confirmPassword === '') {
             alert('Please Enter Password confirm');
             return;
         } else if (confirmPassword !== password) {
             alert('password and password confirmation is not equal');
             return;
        // }  else if (name === '') {
        //     alert('Please Enter Name');
        //     return;
         } else if (phonenumber === '') {
             alert('Please Enter phone number');
             return;
         }
        // }    else if (email === '') {
        //     alert('Please Enter email');
        //     return;
        // } 
        // fetch("http://192.168.43.254:3000/userName", {
        //     method: 'POST',
        //     body:JSON.stringify({"username": username}),
        //     headers: {
        //         'content-type': 'aplication/json',
        //     },
        // }).then(res => res.text()).then(data => {
        //     console.log(data);
        //     if (data=="wrong name"){
        //         console.log("please enter new name");
        //     }
        // });

        fetch(`http://192.168.0.111:5000/users_controller/create_user`, {
            method: 'POST',
            body:JSON.stringify({
                "user_name": username,
                "password": password,
                "name": name,
                "lastname": lastname,
                "age": age,
                "city": city,
                "country": country,
                "email": email,
                "phone_number": phonenumber,
                "id": id,
                "birthdate": birthday}),
            headers: {
                'content-type': 'aplication/json',
            },
        }).then(res => res.text()).then(data => {
            console.log("data: ", data);
            // let response = Object.values(data)[0];
            // console.log("res: ",response);
            // console.log("Object.keys(data): ",Object.keys(data));
            // console.log("--------", Object.keys(data)[0]);
            // console.log("--------", Object.values(data)[0]);
            // if (Object.keys(data).length == 0){
            //     console.log("NONE");
            // }
            if (data=="Username already exists"){
                console.log("Username already exists");
                setError(response);
            }
            else {
                // let id = Object.values(data)[0];
                //id = data
                console.log(data.toString())
                storeData(data.toString());
            }
        }).catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
             // ADD THIS THROW error
              throw error;
            });
    }
    return (

        <ScrollView width="100%">
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.imagecontainer}>
            <Image style={{width:100,height: 100}} source={require('../assets/icon.png')} />
            </View >
            <Text style={styles.textcontainer}>
                <Text>Register</Text>
            </Text>
                <View >
                    
                      <TextInput
                          value={name}
                          onChangeText={(lname) => setName(lname)}
                          placeholder={'First Name'}
                          style={styles.input2}
                          />
                          <TextInput
                          value={lastname}
                          onChangeText={(name) => setLastName(name)}
                          placeholder={'Last Name'}
                          style={styles.input}
                          />
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
                          <TextInput
                          value={confirmPassword}
                          onChangeText={(pass) => setConfirmPassword(pass)}
                          placeholder={'Confirm Password'}
                          secureTextEntry={true}
                          style={styles.input}
                          />
                          <TextInput
                          value={age}
                          onChangeText={(lname) => setAge(lname)}
                          placeholder={'Age'}
                          style={styles.input}
                          keyboardType={'number-pad'}
                          />
                          <TextInput
                          value={city}
                          onChangeText={(name) => setCity(name)}
                          placeholder={'City'}
                          style={styles.input}
                          />
                          <TextInput
                          value={country}
                          onChangeText={(name) => setCountry(name)}
                          placeholder={'Country'}
                          style={styles.input}
                          />
                          <TextInput
                          value={email}
                          onChangeText={(pass) => setEmail(pass)}
                          placeholder={'Email'}
                          style={styles.input}
                          keyboardType={'email-address'}
                          />
                          <TextInput
                          value={phonenumber}
                          onChangeText={(pass) => setPhonenumber(pass)}
                          placeholder={'Phone Number'}
                          style={styles.input}
                          keyboardType={'number-pad'}
                          />
                          <TextInput
                          value={id}
                          onChangeText={(lname) => setId(lname)}
                          placeholder={'ID number'}
                          style={styles.input}
                          keyboardType={'number-pad'}
                          />
                          
                          <TextInput 
                          value={birthday}
                          onChangeText={(name) => setBirthday(name)}
                          placeholder={'Birth Date'}
                          style={styles.input}
                          //keyboardType={'decimal-pad'}

                          />
                          {/* <Button title="Submit" onPress={()=>sendDetails()}/> */}
                          <View>
                            {/* <Pressable style={styles.button1} onPress={()=>sendDetails()}>
                                <Text style={styles.text1}>Send</Text>
                            </Pressable> */}
                            <RectButton marginTop={10} minWidth={170} fontSize={SIZES.large} {...SHADOWS.light} buttonText={"Sign Up"} handlePress={()=>sendDetails()}/>
                         </View>
                      
                </View>
            </SafeAreaView>
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
      textcontainer: {
        fontWeight: 'bold',
        width: 350,
        fontStyle: 'normal',
        textAlign: 'right',
        alignItems:'center',
        height: 70,
        padding: 10,
        borderRadius: 1,
        //borderWidth:1,
        borderColor:'#dcdcdc',
        marginTop: 40,
        marginBottom: 10,
        backgroundColor: COLORS.white,
        color: 'black',
        fontSize: 32,


      },
      text1: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
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
      input2: {
        width: 350,
        borderRadius: 10,
        textAlign: 'left',
        height: 44,
        padding: 10,
        borderWidth:1,
        borderColor:'#dcdcdc',
        marginTop: 10,
        marginBottom: 10,
        //backgroundColor: '#e8e8e8'
      },
    });
    
    
export default SignupScreen
