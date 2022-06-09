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


export default function App() {
  const Drawer = createDrawerNavigator(); 
  // create url
  const url="192.168.43.254:3000";
  
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName = "Home">
      <Drawer.Screen name="Receipts" component={()=><MyReceiptsScreen url={url}/>} options={{ drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./Images/ProfilePic.jpg')}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    ) }}/>
        <Drawer.Screen name="My Profile" component={()=><ProfileScreen url={url}/>}/>
        <Drawer.Screen name="Scan Receipts" component={()=><ScanReceiptsScreen url={url}/>}/>
        <Drawer.Screen name="Store Credits" component={()=><MyStoreCreditsScreen url={url}/>}/>
        <Drawer.Screen name="Expense Analysis" component={()=><ExpenseAnalysisScreen url={url}/>}/>
        <Drawer.Screen name="Settings" component={()=><SettingScreen url={url}/>}/>
        <Drawer.Screen name="Sign Up" component={()=><SignupScreen url={url}/>}/>
        <Drawer.Screen name="Login" component={() => <LoginScreen url={url}/>}/>
        <Drawer.Screen name="Gps" component={GpsScreen}/>
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

