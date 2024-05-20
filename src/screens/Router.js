import React from 'react';
import { useMyContextController } from "../context";
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Login from './Login';
import Customer from './Customer';
import Admin from './Admin';
import COLORS from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddService from './AddService';
import DetailsService from './DetailsService';
import UpdateService from './UpdateService';
import Settings from './Settings';
import Register from './Register';
import Transaction from './Transaction';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const getTabBarIcon = (icon) => ({ color, focused }) => (
    <AntDesign name={icon} size={26} color={focused ? COLORS.pink : color} />
);

const AdminScreens = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: COLORS.pink },
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen name="Homes" component={Admin} options={{ headerShown: false }} />
            {userLogin.role === 'admin' && (
                <Stack.Screen name="AddService" component={AddService} options={{ headerShown: false }} />
            )}
            <Stack.Screen name="DetailsService" component={DetailsService} options={{ headerShown: false }}/>
            <Stack.Screen name="UpdateService" component={UpdateService} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: true }}/>

        </Stack.Navigator>
    );
};

const SettingScreens = () => {
    return (
        <Stack.Navigator
            initialRouteName="Settings"
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: COLORS.pink },
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen name="Settingss" component={Settings} />
        </Stack.Navigator>
    );
};
const TransactionScreens = () => {
    return (
        <Stack.Navigator
            initialRouteName="Transaction"
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: COLORS.pink },
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen name="Transactions" component={Transaction} />
        </Stack.Navigator>
    );
};
const CustomerScreens = () => {
    return (
        <Stack.Navigator
            initialRouteName="Customer"
            screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: COLORS.pink },
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen name="Customers" component={Customer} />
        </Stack.Navigator>
    );
};

const Router = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <>
            {userLogin ? (
                <Tab.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        tabBarActiveTintColor: COLORS.pink,
                        headerShown: false,
                        tabBarShowLabel: true
                    }}
                >
                    {userLogin.role === 'admin' ? (
                        <>
                            <Tab.Screen
                                name="Home"
                                component={AdminScreens}
                                options={{
                                    tabBarIcon: getTabBarIcon('home'), 
                                }}
                            />
                             <Tab.Screen
                                name="Transaction"
                                component={TransactionScreens}
                                options={{
                                    tabBarIcon: getTabBarIcon('shoppingcart'), 
                                }}
                            />
                            <Tab.Screen
                                name="Customer"
                                component={CustomerScreens}
                                options={{
                                    tabBarIcon: getTabBarIcon('user'), 
                                }}
                            />
                            <Tab.Screen
                                name="Setting"
                                component={SettingScreens}
                                options={{
                                    tabBarIcon: getTabBarIcon('setting'), 
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Tab.Screen
                                name="Home"
                                component={AdminScreens}
                                options={{
                                    tabBarIcon: getTabBarIcon('home'), 
                                }}
                            />
                            
                            <Tab.Screen
                                name="Setting"
                                component={SettingScreens}
                                options={{
                                    tabBarIcon: getTabBarIcon('setting'), 
                                }}
                            />
                        </>
                    )}
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
                    <Stack.Screen name="Register" component={Register} />
                </Stack.Navigator>
            )}
        </>
    );
}

export default Router;
