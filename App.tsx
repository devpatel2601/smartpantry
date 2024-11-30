import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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

// Define type for the Stack Navigator's parameters
export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  PantryList: undefined;
  RecipeSuggestions: undefined;
  RecipeDetail: undefined;
  Profile: undefined;
  AddItem: undefined;
  NutritionalAnalysis: undefined;
  GroceryList: undefined;
  Scanner: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
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
