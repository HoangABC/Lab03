import 'react-native-gesture-handler';
import React from 'react';
import { useMyContextController } from "../context";
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Login from './Login';
import Customer from './Customer';
import Admin from './Admin';
import COLORS from '../../constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddService from './AddService';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const getTabBarIcon = icon => ({ tintColor }) => (
    <Icon name={icon} size={26} style={{ color: tintColor }} />
);

const AdminScreens = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: COLORS.blue },
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen name="Home" component={Admin} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

const CustomerScreens = () => {
    return (
        <Stack.Navigator
            initialRouteName="Customer"
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: COLORS.blue },
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen name="Customer" component={Customer} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
const AddServiceScreens = () => {
    return (
        <Stack.Navigator
            initialRouteName="AddService" 
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: COLORS.pink },
                
            }}
        >
            <Stack.Screen name="AddService" component={AddService} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

const Router = () => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    return (
        <>
            {userLogin ? (
                <Tab.Navigator
                    initialRouteName="Home"
                    barStyle={{ backgroundColor: COLORS.blue }}
                    activeColor={COLORS.greyLight}
                    inactiveColor={COLORS.greyDark}
                >
                    <Tab.Screen
                        name="Admin"
                        component={AdminScreens}
                        options={{
                            tabBarIcon: getTabBarIcon('home'),
                        }}
                    />
                    <Tab.Screen
                        name="Customer"
                        component={CustomerScreens}
                        options={{
                            tabBarIcon: getTabBarIcon('list'),
                        }}
                    />
                     <Tab.Screen
                        name="Service"
                        component={AddServiceScreens}
                        options={{
                            tabBarIcon: getTabBarIcon('list'),
                        }}
                    />
                </Tab.Navigator>
            ) : (
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Navigator>
            )}
        </>
    );
}

export default Router;
