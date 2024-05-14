import 'react-native-gesture-handler';
import React from 'react';
import { MyContextControllerProvider } from './src/context/';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Router from './src/screens/Router';
import { StatusBar } from 'react-native';
import COLORS from "./constants";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <StatusBar backgroundColor={COLORS.pink} />
      <MyContextControllerProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Router" component={Router} />
          </Stack.Navigator>
        </NavigationContainer>
      </MyContextControllerProvider>
    </PaperProvider>
  );
}

export default App;
