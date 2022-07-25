import React, {useState, useEffect, useRef, createRef} from 'react';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { View, Text,Button,Modal,Pressable,Image, ImageBackground, TextInput, SafeAreaView, StyleSheet } from 'react-native';
import GpsScreen from './Gps';
import * as Device from 'expo-device';
import {useNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { Card, SearchBar, FocusedStatusBar ,RectButton} from "../components";
import * as TaskManager from 'expo-task-manager';
const LOCATION_TASK_NAME = "LOCATION_TASK"
const LOCATION_CREDIT_TASK_ = "LOCATION_CREDIT_TASK"

import {DefaultTheme } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  console.log("LOCATION_TASK_NAME");
  //const [expoPushToken, setExpoPushToken] = useState('');
  //let token;
  if (error) {
    console.error(error)
    return
  }
  if (data) {
    // Extract location coordinates from data
    let isNotification = false;
    const { locations } = data
    const location = locations[0]
    let latitude = locations[0].coords.latitude;
    let longitude = locations[0].coords.longitude;
    if (location) {

      (async () => {  fetch(`http://192.168.0.111:5000/location_controller/get_nearest_store`, {
        method: 'POST',
        body:JSON.stringify({latitude,longitude,"user_key":"b91c59eeca42460283ec295b1bab861c"                    
        }),
        headers: {
            'content-type': 'aplication/json',
            //'loaction':{latitude,longitude},
        },
    }).then(res => res.text()).then(async (data) => {
        //console.log("data: ", data);
        // let response = Object.values(data)[0];
        // console.log("res: ",response);
        if (data=="False"){
            console.log("false");
            //setError(data);
        }
        else {
            //console.log(data['1']);
            //console.log({expoPush});
            let storeName = JSON.parse(data)["1"]
            //let today = new Date().getDate();
            //console.log(today);
            isNotification = true;
            console.log("send notification");

            console.log(JSON.parse(data)["1"]);

            console.log("Location in background", location.coords);
        let token;
      if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      //console.log(token);
      } else {
        alert('Must use physical device for Push Notifications');
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
        console.log(token);
      // console.log({expoPushToken})
        let message = {
          to: token,
          sound: 'default',
          title: 'Digital-receipt Products',
          body: 'Watch all the '+ storeName +' products you might like',
          //data: { someData: 'goes here' },
          data: storeName,
        };
      
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
            //console.log(data);

        }
        console.log("end");
    });
  })();
    }
    //registerForPushNotificationsAsync().then(token => {console.log(token)});
  }
})
TaskManager.defineTask(LOCATION_CREDIT_TASK_, async ({ data, error }) => {
  //const [expoPushToken, setExpoPushToken] = useState('');
  //let token;
  if (error) {
    console.error(error)
    return
  }
  if (data) {
    // Extract location coordinates from data
    let isNotification = false;
    const { locations } = data
    const location = locations[0]
    let latitude = locations[0].coords.latitude;
    let longitude = locations[0].coords.longitude;
    if (location) {

      (async () => {  fetch(`http://192.168.0.111:5000/location_controller/exist_credit_to_nearest_store`, {
        method: 'POST',
        body:JSON.stringify({latitude,longitude,
                            "user_key":"530feb6b8263491d969d979e4234259c"                    
        }),
        headers: {
            'content-type': 'aplication/json',
            //'loaction':{latitude,longitude},
        },
    }).then(res => res.text()).then(async (data) => {
        //console.log("data: ", data);
        // let response = Object.values(data)[0];
        // console.log("res: ",response);
        if (data=="False"){
            console.log("false");
            //setError(data);
        }
        else {
            //console.log(data['1']);
            //console.log({expoPush});
            let storeName = JSON.parse(data)["1"]
            //let today = new Date().getDate();
            //console.log(today);
            isNotification = true;
            console.log("send notification");

            console.log(JSON.parse(data)["1"]);

            console.log("Location in background", location.coords);
        let token;
      if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      //console.log(token);
      } else {
        alert('Must use physical device for Push Notifications');
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
        console.log(token);
       console.log({expoPushToken})
        let message = {
          to: token,
          sound: 'default',
          title: 'Digital-receipt Credits',
          body: 'Watch Your '+ storeName +' credits',
          data: storeName,
          //data: { someData: 'goes here' },
        };
      
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
            //console.log(data);

        }
        console.log("end");
    });
  })();
    }
    //registerForPushNotificationsAsync().then(token => {console.log(token)});
  }
})
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const LoginScreen = ({ route}) => {
    const [username, setUsername] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [isInterval, setisInterval] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [timeOfLastPush, setTimeOfLastPush] = useState(0);
    const notificationListener = useRef();
    const responseListener = useRef();
    const url = "192.168.43.254";

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
      useEffect(() => {
        // (async () => {
        //     let { status } = await Location.requestForegroundPermissionsAsync();
        //     if (status !== 'granted') {
        //       setErrorMsg('Permission to access location was denied');
        //       return;
        //     }
        //     let { Backgroundstatus } = await Location.requestBackgroundPermissionsAsync();
        //     if (Backgroundstatus !== 'granted') {
        //       setErrorMsg('Permission to access location was denied');
        //       return;
        //     }
        //     //let location = await Location.getCurrentPositionAsync({});
            
        //     //setLocation(location);
        //   })();
          // (async () => {
          //   // Don't track position if permission is not granted
          //   const { granted } = await Location.getBackgroundPermissionsAsync()
          //   if (!granted) {
          //     console.log("location tracking denied")
          //     return
          //   } else {
          //       console.log("location tracking succsess")
                
          //   }
        
          //   // Make sure the task is defined otherwise do not start tracking
          //   const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME)
          //   if (!isTaskDefined) {
          //     console.log("Task is not defined")
          //     return
          //   }
        
          //   // Don't track if it is already running in background
          //   const hasStarted = await Location.hasStartedLocationUpdatesAsync(
          //     LOCATION_TASK_NAME
          //   )
          //   if (hasStarted) {
          //     console.log("Already started")
          //     return
          //   }
        
          //   // await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          //   //   // For better logs, we set the accuracy to the most sensitive option
          //   //   accuracy: Location.Accuracy.BestForNavigation,
          //   //   // Make sure to enable this notification if you want to consistently track in the background
          //   //   deferredUpdatesInterval: 10000,
          //   //   showsBackgroundLocationIndicator: true,
          //   //   foregroundService: {
          //   //     notificationTitle: "Location",
          //   //     notificationBody: "Location tracking in background",
          //   //     notificationColor: "#fff",
          //   //   },
          //   // })
          // })();
        let temptoken;
        registerForPushNotificationsAsync().then(token => {setExpoPushToken(token)});
    
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
          setTimeOfLastPush(new Date().getDate());
        });
    
        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response["title"] );
          if (response["title"] === "Digital-receipt Credits") {
            navigation.navigate('Store Credits');
          } else {
            navigation.navigate('Home');
          }
        });
        
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);
      // useEffect(() => {
      //          //setModalVisible(true)

      //       (async () => {fetch(`http://192.168.0.111:5000/users_controller/login_user_name_and_password`, {
      //         method: 'POST',
      //         body:JSON.stringify({"username": username, "password": password}),
      //         headers: {
      //             'content-type': 'aplication/json',
      //         },
      //     }).then(res => res.text()).then(data => {
      //         console.log("data: ", data);
      //         // let response = Object.values(data)[0];
      //         // console.log("res: ",response);
      //         if (data=="false"){
      //             console.log("false");
      //             setModalVisible(false)
      //             //setError(data);
      //         }
      //         else {
      //           setModalVisible(true)
      //             // let id = Object.values(data)[0];
      //         }
      //         //console.log("end");
      //     });
      //  })();
      // },[])

    async function sendDetails() {
        fetch(`http://${route.params.url}/users_controller/login_user_name_and_password`, {
            method: 'POST',
            body:JSON.stringify({"user_name": username, "password": password}),
            headers: {
                'content-type': 'aplication/json',
            },
        }).then(res => res.text()).then(data => {
            console.log("data: ", data);

            if (data=="the user name or password incorrect"){
                console.log("the user name or password incorrect");
                setError(data);
            }
            else {
                console.log(data.toString())
                storeData(data.toString());
                fetch(`http://${route.params.url}/scan_credit_controller/exist_expired_credit`, {
                  method: 'POST',
                  body:JSON.stringify({"user_key": data.toString()}),
                  headers: {
                      'content-type': 'aplication/json',
                  },
              }).then(res => res.text()).then(data1 => {
                  console.log("data: ", data1);
                  if (data1=="false"){
                      console.log("false");
                      setModalVisible(false)
                      navigation.navigate('Home');
                  }
                  else {
                    setModalVisible(true)
                  }
              });
           
            }
        });
    }
    async function registerForPushNotificationsAsync() {
      let token;
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
      } else {
        alert('Must use physical device for Push Notifications');
      }
    
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    
      return token;
    }
    return (
        <View style={{flex:2, alignItems:'center',position:'relative', marginTop: 10, top: 0,bottom: 0,right: 0,left: 0,
        zIndex: -1, justifyContent:'center' ,height: '50%'}}  >
            <SafeAreaView style={{ flex: 1 }}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!isModalVisible);
              }}
            >
                        <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>You have a store credit that is about to expire!</Text>
              <Pressable
                style={[styles.button3, styles.buttonClose]}
                onPress={() =>{setModalVisible(!isModalVisible); navigation.navigate('Store Credits')}}
              >
                
                <Text style={styles.textStyle}>Go To Credits</Text>
              </Pressable>
              <Pressable
                style={[styles.button3, styles.buttonClose]}
                onPress={() => {setModalVisible(!isModalVisible);  navigation.navigate('Home')}}
              >
                
                <Text style={styles.textStyle}>No Thanks</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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

                    <RectButton marginTop={10} minWidth={170} fontSize={SIZES.large} {...SHADOWS.light} buttonText={"Sign in"} handlePress={()=>sendDetails()}/>

                    </View>
                    <View>

                    <RectButton marginTop={10} minWidth={170} fontSize={SIZES.large} {...SHADOWS.light} buttonText={"Login via SMS"} handlePress={()=>navigation.navigate('SMSLogin')}/>
                     </View>

                     <View style={{marginVertical: 8}}>
                     <Pressable style={styles.button} onPress={()=>navigation.navigate('Sign Up')}>
                         <Text style={styles.text}>Don't have account? Sign up</Text>
                    </Pressable> 
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button3: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: COLORS.primary,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center"
  }
});


export default LoginScreen
