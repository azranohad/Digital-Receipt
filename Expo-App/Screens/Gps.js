// import React from 'react'
// import { View, Text } from 'react-native'

// const GpssScreen = () => {
//     return (
//         <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
//             <Text>This is Gps Screen</Text>
//         </View>
//     )
// }

// export default GpssScreen

import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

export default function Gps({navigation, route}) {
  const pressHandler = () => {
    navigation.goBack();
  }

  useEffect(() => {
    registerForPushNotification().then(token=>console.log(token)).catch(err => console.log(Err))
    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   console.log(notification);
    // });
    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log(response);
    // });
    // return () => {
    //   cleanup
    // }
  }, [])

  async function registerForPushNotification(){
    const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status != 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      // finalStatus = status;
    }
    if (status !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token
  }

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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
  }, []);

  let text = 'Waiting..';
  let latitude = 'connecting ..'
  let longitude = 'connecting ..'
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    console.log("----------------------------------")
    text = JSON.stringify(location);
    let myObj = JSON.parse(text);
    let coords = myObj.coords;
    latitude = coords.latitude
    longitude = coords.longitude
    const myJSON = '{"latitude":latitude,"longitude":longitude}'
    console.log("myJSON ")
    console.log(myJSON)
  }

  var closestStores = calcdistance(longitude, latitude)





  return (
    <View style={styles.container}>
      <Text>longitude is:</Text>
      <Text>{longitude}</Text>
      <Text>latitude is:</Text>
      <Text>{latitude}</Text>
      <Text>{closestStores}</Text>

    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});



class Store {
  constructor(name, store_longitude, store_latitude, city) {
    this.name = name;
    this.store_latitude = store_latitude;
    this.store_longitude = store_longitude;
    this.city = city;
  }
}

function calcdistance(currentLongitude, currentLatitude){
  var stores = []
  var coffee_time = new Store("coffee time", 34.84361, 32.06853, "רמת גן");
  console.log("coffee_time")
  console.log(coffee_time)
  var b605 = new Store("605 building", 34.84340, 32.07044, "רמת גן");
  var b504 = new Store("504 building", 34.84437, 32.06974, "רמת גן");
  var Aroma = new Store("Aroma", 34.84554, 32.06811, "רמת גן");
  var superPharm = new Store("Super Pharm", 34.8545, 32.07734, "גבעת שמואל");
  stores.push(coffee_time)
  stores.push(b605)
  stores.push(b504)
  stores.push(Aroma)
  stores.push(superPharm)

  var cities_to_print = "I am close to:\n"
  var currentCity = "רמת גן"
  for (let s of stores){
    if (s.city == (currentCity)){
      if ((Math.abs(currentLongitude - s.store_longitude) < 0.001) &&
              (Math.abs(currentLatitude - s.store_latitude) < 0.001)){
        cities_to_print+=s.name;
        cities_to_print+="\n";
      }
    }
  }
  console.log("cities_to_print")
  console.log(cities_to_print)
  if(cities_to_print == ""){
    cities_to_print = "I am not close to any store"
  }
  return cities_to_print
}