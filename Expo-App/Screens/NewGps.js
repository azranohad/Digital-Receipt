import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import React, { useState, useEffect, useRef, createRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function NewGps({navigation, route}, props) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [isInterval, setisInterval] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [timeOfLastPush, setTimeOfLastPush] = useState(0);
  const notificationListener = useRef();
  const responseListener = useRef();
  //const navigation = useNavigation();

  useEffect(() => {
    (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        
        setLocation(location);
      })();
    let temptoken;
    registerForPushNotificationsAsync().then(token => {setExpoPushToken(token)});

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      setTimeOfLastPush(new Date().getDate());
      //console.log(timeOfLastPush);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      navigation.navigate('Sign Up');
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // (async() => {
  //   const interval = setInterval(() => {
  //     if(!isInterval){
  //     sendNavData(expoPushToken, timeOfLastPush);} }, 20000);
  //   return () => {
  //     clearInterval(interval);
      
  //   };
  // })();
  // setisInterval(true);
  // useEffect(() => {
  //   const interval = setInterval(() => 
  //     sendNavData(expoPushToken, timeOfLastPush), 20000);
  //   return () => {
  //     clearInterval(interval);
      
  //   };
  // },[]);
  useEffect(() => {
    const interval = setInterval(() => 
      sendNavData(expoPushToken, timeOfLastPush), 20000);
    return () => {
      clearInterval(interval);
      
    };
  },[expoPushToken,timeOfLastPush]);
  // () => {
  //   const interval = setInterval(() => sendNavData(expoPushToken, timeOfLastPush), 20000);
  //   return () => {
  //     clearInterval(interval);
      
  //   };
  // };

  let text = 'Waiting..';
  let latitude = 'connecting ..'
  let longitude = 'connecting ..'
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    //console.log("----------------------------------")
    text = JSON.stringify(location);
    let myObj = JSON.parse(text);
    let coords = myObj.coords;
    latitude = coords.latitude
    longitude = coords.longitude
    const myJSON = {"latitude":latitude,"longitude":longitude}
    //console.log("myJSON ")
    //console.log(myJSON)
  }
  async function sendNavData (expoPush,timeOfLastPush){
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    //setLocation(location);
    //console.log({location});
    let text = 'Waiting..';
    let latitude = 'connecting ..'
    let longitude = 'connecting ..'

      //console.log("----------------------------------")
      text = JSON.stringify(location);
      let myObj = JSON.parse(text);
      let coords = myObj.coords;
      let dict = {}
      latitude = coords.latitude
      longitude = coords.longitude
      const myJSON = {latitude,longitude}
      let latitudeToSend = myJSON.latitude;
      let longitudeToSend = myJSON.longitude;

    //console.log(myJSON);
    fetch(`http://192.168.0.111:5000/location_controller/get_nearest_store`, {
        method: 'POST',
        body:JSON.stringify({latitude,longitude}),
        headers: {
            'content-type': 'aplication/json',
            //'loaction':{latitude,longitude},
        },
    }).then(res => res.text()).then(data => {
        //console.log("data: ", data);
        // let response = Object.values(data)[0];
        // console.log("res: ",response);
        if (data=="Incorrect username or password"){
            console.log("Incorrect username or password");
            setError(data);
        }
        else {
            //console.log(data['1']);
            //console.log({expoPush});
            let storeName = JSON.parse(data)["1"]
            let today = new Date().getDate();
            console.log(today);
            console.log(timeOfLastPush);

            if (timeOfLastPush !== today) {
                
                //setTime(today);
                sendPushNotification(expoPushToken,storeName);
                console.log("send notification");
            }
            //storeData(data.toString());
            //console.log(data);
            console.log(JSON.parse(data)["1"]);
            //console.log(data);

        }
        console.log("end");
    });
    //sendPushNotification(expoPush);
  }
  async function sendPushNotification(expoPushToken,storeName) {
    console.log({expoPushToken})
   const message = {
     to: expoPushToken,
     sound: 'default',
     title: 'Digital-receipt',
     body: 'Watch all '+ storeName +' sales',
     data: { someData: 'goes here' },
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

  return token;
}
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}
async function sendDiscountRequest(data){
    //sendPushNotification(expoPushToken,data);
    fetch(`http://192.168.0.111:5000/location_controller/get_nearest_store`, {
        method: 'POST',
        body:JSON.stringify({latitude,longitude}),
        headers: {
            'content-type': 'aplication/json',
            //'loaction':{latitude,longitude},
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
            console.log(data);

        }
        console.log("end");
    });
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications




