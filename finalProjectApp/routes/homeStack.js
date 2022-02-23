import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from '../screens/home';
import Gps from '../screens/Gps';

const screens = {
    Home: {
        screen: Home,
    }
    ,
    Gps: {
        screen: Gps
    }
}

const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#444',
        headerStyle: { backgroundColor: '#eee', height: 70}
    }
});

export default createAppContainer(HomeStack);