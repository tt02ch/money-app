import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';

// pages
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AddScreen from './screens/AddScreen';
import UpdateScreen from './screens/UpdateScreen';
import AllTransactions from './screens/AllTransactions';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Ẩn tất cả các cảnh báo tạm thời
    LogBox.ignoreAllLogs(); 
    // Hoặc chỉ ẩn cảnh báo cụ thể
    LogBox.ignoreLogs([
      'Warning: TextElement: Support for defaultProps will be removed from function components in a future major release.',
      'You are initializing Firebase Auth for React Native without providing AsyncStorage.' // Cảnh báo Firebase
    ]);
  }, []);

  const globalScreenOptions = {
    headerStyle: {
      backgroundColor: '#DDD5F1',
    },
    headerTitleStyle: {
      color: '#000000',
    },
    headerTintColor: 'black',
  };

  return (
    <NavigationContainer>
      <StatusBar style='dark' />
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Add' component={AddScreen} />
        <Stack.Screen name='Update' component={UpdateScreen} />
        <Stack.Screen name='All' component={AllTransactions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
