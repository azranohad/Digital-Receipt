import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from '../screens/home';
import Gps from '../screens/Gps';
import About from '../screens/about';

const screens = {
    About: {
        screen: About,
    },
    Gps: {
        screen: Gps
    }
}

const AboutStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#444',
        headerStyle: { backgroundColor: '#eee', height: 70}
    }
});

export default createAppContainer(AboutStack);

// import React from 'react';
// import {createDrawerNavigator} from '@react-navigation/drawer';

// import CustomDrawer from '../components/CustomDrawer';

// import Ionicons from 'react-native-vector-icons/Ionicons';

// import HomeScreen from '../screens/home';
// import GPSScreen from '../screens/gps';
// import AboutScreen from '../screens/about';

// const Drawer = createDrawerNavigator();

// const aboutStack = () => {
//   return (
//     <Drawer.Navigator
//       drawerContent={props => <CustomDrawer {...props} />}
//       screenOptions={{
//         headerShown: false,
//         drawerActiveBackgroundColor: '#aa18ea',
//         drawerActiveTintColor: '#fff',
//         drawerInactiveTintColor: '#333',
//         drawerLabelStyle: {
//           marginLeft: -25,
//           fontFamily: 'Roboto-Medium',
//           fontSize: 15,
//         },
//       }}>
//       <Drawer.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           drawerIcon: ({color}) => (
//             <Ionicons name="home-outline" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="GPS"
//         component={GPSScreen}
//         options={{
//           drawerIcon: ({color}) => (
//             <Ionicons name="person-outline" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="About"
//         component={AboutScreen}
//         options={{
//           drawerIcon: ({color}) => (
//             <Ionicons name="chatbox-ellipses-outline" size={22} color={color} />
//           ),
//         }}
//       />
//     </Drawer.Navigator>
//   );
// };

// export default aboutStack;