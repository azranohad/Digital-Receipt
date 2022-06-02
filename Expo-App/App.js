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
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName = "Home">
        <Drawer.Screen name="Home" component={HomeScreen} options={{ drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./Images/ProfilePic.jpg')}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    ) }}/>
        <Drawer.Screen name="My Profile" component={ProfileScreen}/>
        <Drawer.Screen name="Scan Receipts" component={ScanReceiptsScreen}/>
        <Drawer.Screen name="Store Credits" component={MyStoreCreditsScreen}/>
        <Drawer.Screen name="Receipts" component={MyReceiptsScreen}/>
        <Drawer.Screen name="Expense Analysis" component={ExpenseAnalysisScreen}/>
        <Drawer.Screen name="Settings" component={SettingScreen}/>
        <Drawer.Screen name="Sign Up" component={SignupScreen}/>
        <Drawer.Screen name="Login" component={LoginScreen}/>
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

