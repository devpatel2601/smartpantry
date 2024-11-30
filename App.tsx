import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Import Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import PantryListScreen from './src/screens/PantryListScreen';
import RecipeSuggestionsScreen from './src/screens/RecipeSuggestionScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import NutritionalAnalysisScreen from './src/screens/NutritionalAnalysisScreen';
import GroceryListScreen from './src/screens/SmartGroceryListScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import LoginScreen from './src/screens/LoginScreen';  // Import the Login screen

// Firebase initialization
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyAu6DMowg-mWALp5hNg0gZTnYi9R_GQUKE',
    authDomain: 'smartpantryapp-a524e.firebaseapp.com',
    databaseURL: 'https://smartpantryapp-a524e.firebaseio.com',
    projectId: 'smartpantryapp-a524e',
    storageBucket: 'smartpantryapp-a524e.appspot.com',
    messagingSenderId: '563212127735',
    appId: '1:563212127735:android:7e1a25fcaed2121019f2f2',
  });
} else {
  firebase.app();
}

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Store current user

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser); // Update user state when auth state changes
    return () => unsubscribe(); // Cleanup the subscription when the app unmounts
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Welcome" : "Login"}>
        {/* Login Screen */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

        {/* Other screens */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PantryList" component={PantryListScreen} />
        <Stack.Screen name="RecipeSuggestions" component={RecipeSuggestionsScreen} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="AddItem" component={AddItemScreen} />
        <Stack.Screen name="NutritionalAnalysis" component={NutritionalAnalysisScreen} />
        <Stack.Screen name="GroceryList" component={GroceryListScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
