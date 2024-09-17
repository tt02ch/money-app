import React, { useContext } from 'react';  // Only import React
import { TouchableOpacity, View, Text, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesProvider } from './context/FavoriteContext';
import ThemeContext, { ThemeProvider } from './context/ThemeContext';  // Correctly use ThemeContext
import CategoryScreen from './screens/CategoryScreen';
import SettingScreen from './screens/SettingScreen';
import FavoriteScreen from './screens/FavoriteScreen';
import MealScreen from './screens/MealScreen';
import { Colors } from './color';

// Create the stack, drawer, and bottom tab navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// A simple blank screen component for "Go to Tabs"
const BlankScreen = () => <View><Text></Text></View>;

// Bottom Tab Navigator
function BottomTabs({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext);  // Use isDarkMode from context

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Categories') {
            iconName = 'fast-food-outline';
          } else if (route.name === 'Favorites') {
            iconName = 'heart';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.main,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: isDarkMode ? '#1f1f1f' : '#fff' }, // Change based on theme
        headerStyle: { backgroundColor: isDarkMode ? '#1f1f1f' : '#fff' }, // Change based on theme
        headerTintColor: isDarkMode ? '#fff' : '#000',  // Change based on theme
      })}
    >
      <Tab.Screen 
        name="Categories" 
        component={CategoryScreen} 
        options={{
          title: 'Categories',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoriteScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

// Drawer Navigator
function DrawerNavigator({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext);  // Use isDarkMode from context

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: 'tomato',
        drawerInactiveTintColor: 'gray',
        drawerStyle: { backgroundColor: isDarkMode ? '#1f1f1f' : '#fff' },  // Change based on theme
        headerStyle: { backgroundColor: isDarkMode ? '#1f1f1f' : '#fff' },  // Change based on theme
        headerTintColor: isDarkMode ? '#fff' : '#000',  // Change based on theme
      }}
    >
      <Drawer.Screen 
        name="Categories" 
        component={CategoryScreen} 
        options={{
          title: 'Categories',
        }}
      />
      <Drawer.Screen name="Favorites" component={FavoriteScreen} />
      <Drawer.Screen name="Settings" component={SettingScreen} />
      <Drawer.Screen
        name="Go to Tabs"
        component={BlankScreen}
        options={{ drawerLabel: 'Go to Tabs' }}
        listeners={{
          drawerItemPress: () => navigation.replace('BottomTabs'), 
        }}
      />
    </Drawer.Navigator>
  );
}

// Main App component
export default function App() {
  return (
    <ThemeProvider> 
      <FavoritesProvider>
        <NavigationContainer theme={useContext(ThemeContext).isDarkMode ? DarkTheme : DefaultTheme}>
          <StatusBar barStyle={useContext(ThemeContext).isDarkMode ? 'light-content' : 'dark-content'} />
          <Stack.Navigator>
            <Stack.Screen 
              name="BottomTabs" 
              component={BottomTabs} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Drawer" 
              component={DrawerNavigator} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Meals" 
              component={MealScreen} 
              options={({ route }) => ({ 
                title: route.params.name,
                //headerTransparent: true,
                headerTintColor:  useContext(ThemeContext).isDarkMode ? 'white' : 'black',
                headerStyle: {
                  backgroundColor: !useContext(ThemeContext).isDarkMode ? Colors.lightbg : Colors.darkbg,  
                },
              })} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
