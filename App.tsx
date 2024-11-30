// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './src/firebaseConfig'; // Correct import of auth from react-native-firebase

// Import Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import PantryListScreen from './src/screens/PantryListScreen';
import RecipeSuggestionsScreen from './src/screens/RecipeSuggestionScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import NutritionalAnalysisScreen from './src/screens/NutritionalAnalysisScreen';
import GroceryListScreen from './src/screens/SmartGroceryListScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import LoginScreen from './src/screens/LoginScreen';  // Import the Login screen

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Store current user

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser); // Listen for auth state changes
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
        <Stack.Screen name="AddItem" component={AddItemScreen} />
        <Stack.Screen name="NutritionalAnalysis" component={NutritionalAnalysisScreen} />
        <Stack.Screen name="GroceryList" component={GroceryListScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
