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

import {DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
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
  const url="192.168.43.254:5000";

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
      <Drawer.Navigator initialRouteName = "Home" screenOptions={{headerTitle:"", headerTransparent:true}}>
        <Drawer.Screen name="Home"  component={HomeScreen} 
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
        <Drawer.Screen name="My Profile" component={ProfileScreen} initialParams={{url: url}}/>
        <Drawer.Screen name="Receipts" component={MyReceiptsScreen} initialParams={{url: url}}/>
        <Drawer.Screen name="Scan Receipts" component={ScanReceiptsScreen} initialParams={{url: url}}/>
        <Drawer.Screen name="Store Credits" component={MyStoreCreditsScreen} initialParams={{url: url}}/>
        <Drawer.Screen name="Expense Analysis" component={ExpenseAnalysisScreen} initialParams={{url: url}}/>
        <Drawer.Screen name="Settings" component={SettingScreen} initialParams={{url: url}}/>
        <Drawer.Screen name="Sign Up" component={SignupScreen} initialParams={{url: url}}/>
        <Drawer.Screen name="Login" component={LoginScreen} initialParams={{url: url}}/>
        <Drawer.Screen name="Gps" component={GpsScreen}/>
        <Drawer.Screen name="Products" component={ProductsScreen}/>
        <Drawer.Screen name="SMSLogin" component={SMSLoginScreen} initialParams={{url: url}}/>
      <Drawer.Screen name="DigitalReceipt" component={DigitalReceipt}/>
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
