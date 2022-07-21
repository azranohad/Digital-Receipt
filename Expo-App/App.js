import React from 'react';

import 'react-native-gesture-handler';
import { ImageBackground,Image, StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import HomeScreen from './Screens/Home';
import SettingScreen from './Screens/Settings';
import ExpenseAnalysisScreen from './Screens/ExpenseAnalysis';
import ScanReceiptsScreen from './Screens/ScanReceipts';
import MyStoreCreditsScreen from './Screens/MyStoreCredits';
import MyReceiptsScreen from './Screens/MyReceipts';
import GpsScreen from './Screens/Gps';
import LoginScreen from './Screens/Login';
import SignupScreen from './Screens/Signup';
import ProfileScreen from './Screens/Profile';
import SMSLoginScreen from './Screens/SMSLogin';
import ProductsScreen from './Screens/Products';
import DigitalReceipt from './components/DigitalReceipt';
import DigitalCredit from './components/DigitalCredit';
import newGpsScreen from './Screens/NewGps';
import UserLocationScreen from './Screens/UserLocation';
import ScanedImage from './Screens/ScanedImage';
import StoreProducts from './Screens/StoreProducts';
import StoreCreditSoonExpire from './Screens/StoreCreditSoonExpires';

import {DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import {LogBox} from "react-native";

LogBox.ignoreLogs([
"exported from 'deprecated-react-native-prop-types'.",
])

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

export default function App() {
  const Drawer = createDrawerNavigator(); 
  // create url
  const url="192.168.0.111:5000";

  const [loaded] = useFonts({
    InterBold: require("./assets/fonts/Inter-Bold.ttf"),
    InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
    InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
    InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
    InterLight: require("./assets/fonts/Inter-Light.ttf"),
  });

  if (!loaded) return null;

  
  
  return (
    <NavigationContainer theme={theme} >
      <Drawer.Navigator initialRouteName = "Login" initialParams={{url: url}} screenOptions={{headerTitle:"", headerTransparent:true, drawerItemStyle:{borderBottomWidth: 0.5}, drawerLabelStyle:{fontStyle:'italic'}}}>
      <Drawer.Screen name="Login" component={LoginScreen} initialParams={{url: url}} options={{drawerItemStyle: {height:0}}}/>
        <Drawer.Screen name="Home"  component={HomeScreen} options={{drawerItemStyle: {height:0}} }
    //     options={{headerStyle: {
    //     position: 'absolute',
    //     backgroundColor: 'transparent',
    //     zIndex: 100,
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     elevation: 0,
    //     shadowOpacity: 0,
    //     borderBottomWidth: 0,
    //   }
    // //   ,drawerIcon: ({ tintColor }) => (
    // //   <Image
    // //     source={require('./Images/ProfilePic.jpg')}
    // //     style={[styles.icon, { tintColor: tintColor }]}
    // //   />
    // // )
    //  }}
     />
        <Drawer.Screen name="My Profile" component={ProfileScreen} initialParams={{url: url}} />
        <Drawer.Screen name="Receipts" component={MyReceiptsScreen} initialParams={{url: url}}/>
        <Drawer.Screen name="Scan Receipts" component={ScanReceiptsScreen} initialParams={{url: url}}/>
        <Drawer.Screen name="Store Credits" component={MyStoreCreditsScreen} initialParams={{url: url}}/>
        <Drawer.Screen name="Products" component={ProductsScreen}  initialParams={{url: url}}/>
        {/* <Drawer.Screen name="Expense Analysis" component={ExpenseAnalysisScreen} initialParams={{url: url}}/> */}
        {/* <Drawer.Screen name="Settings" component={SettingScreen} initialParams={{url: url}}/> */}
        <Drawer.Screen name="Sign Up" component={SignupScreen} initialParams={{url: url}} options={{drawerItemStyle: {height:0}}}/>
        {/* <Drawer.Screen name="Login" component={LoginScreen} initialParams={{url: url}}/> */}
        {/* <Drawer.Screen name="Gps" component={GpsScreen}/> */}
        {/* <Drawer.Screen name="Gps" component={GpsScreen}/> */}
        <Drawer.Screen name="SMSLogin" component={SMSLoginScreen} initialParams={{url: url}} options={{drawerItemStyle: {height:0}}}/>
      <Drawer.Screen name="DigitalReceipt" component={DigitalReceipt} initialParams={{url: url}} options={{drawerItemStyle: {height:0}}}/>
      <Drawer.Screen name="DigitalCredit" component={DigitalCredit} initialParams={{url: url}} options={{drawerItemStyle: {height:0}}} />
        <Drawer.Screen name="ScanedImage" component={ScanedImage} initialParams={{url: url}} options={{drawerItemStyle: {height:0}}}/>
        <Drawer.Screen name="StoreProduct" component={StoreProducts} initialParams={{url: url}} options={{drawerItemStyle: {height:0}}}/>
        <Drawer.Screen name="StoreCreditSoonExpire" component={StoreCreditSoonExpire} initialParams={{url: url}} options={{drawerItemStyle: {height:0}}}/>

        {/* <Drawer.Screen name="newGps" component={newGpsScreen} initialParams={{url: url}}/> */}
        {/* <Drawer.Screen name="UserLocation" component={UserLocationScreen} initialParams={{url: url}}/> */}

      </Drawer.Navigator>
    </NavigationContainer>
    
  ); 
}

const styles = StyleSheet.create({
    icon: {
      width: 24,
      height: 24,
    },
});
