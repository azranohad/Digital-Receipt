import React from 'react';
import { ImageBackground, Styl1eSheet, Text, View } from 'react-native';
// import Navigator from './routes/homeStack';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import HomeeScreen from './screens/Homee';
import SettingScreen from './screens/Setting';
import ExpenseAnalysisScreen from './screens/ExpenseAnalysis';
import ScanReceiptsScreen from './screens/ScanReceipts';
import ZikuyimScreen from './screens/Zikuyim';
import GpsScreen from './screens/Gps';
import StoresScreen from './screens/Stores';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Drawer } from 'native-base';


export default function App() {

  const Drawer = createDrawerNavigator(); 
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName = "Home">
        <Drawer.Screen name="Home" component={HomeeScreen}/>
        <Drawer.Screen name="Stores" component={StoresScreen}/>
        <Drawer.Screen name="Zikuyim" component={ZikuyimScreen}/>
        <Drawer.Screen name="Expense Analysis" component={ExpenseAnalysisScreen}/>
        <Drawer.Screen name="Scan Receipts" component={ScanReceiptsScreen}/>
        <Drawer.Screen name="Gps" component={GpsScreen}/>
        <Drawer.Screen name="Setting" component={SettingScreen}/>
      </Drawer.Navigator>
    </NavigationContainer>
    // <Navigator>
      
    // </Navigator>
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    // </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#008080',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
  
// });