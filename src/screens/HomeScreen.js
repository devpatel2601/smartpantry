import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';



// Get screen width and height
const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>{getGreeting()}, Dev!</Text>
        <Text style={styles.subtitle}>What would you like to do today?</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.scanButton]} 
          onPress={() => navigation.navigate('Scanner')}
        >
          <Icon name="plus-circle" type="font-awesome-5" color="#ffffff" size={28} />
          <Text style={styles.buttonText}>Scan Item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.addButton]} 
          onPress={() => navigation.navigate('AddItem')}
        >
          <Icon name="plus-circle" type="font-awesome-5" color="#ffffff" size={28} />
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.viewButton]} 
          onPress={() => navigation.navigate('PantryList')}
        >
          <Icon name="list-alt" type="font-awesome-5" color="#ffffff" size={28} />
          <Text style={styles.buttonText}>View Pantry</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.recipeButton]} 
          onPress={() => navigation.navigate('RecipeSuggestions')}
        >
          <Icon name="utensils" type="font-awesome-5" color="#ffffff" size={28} />
          <Text style={styles.buttonText}>Find Recipes</Text>
        </TouchableOpacity>

        {/* New Button to Navigate to Nutritional Analysis Screen */}
        <TouchableOpacity 
          style={[styles.button, styles.nutritionButton]} 
          onPress={() => navigation.navigate('NutritionalAnalysis')}
        >
          <Icon name="apple-alt" type="font-awesome-5" color="#ffffff" size={28} />
          <Text style={styles.buttonText}>Nutritional Analysis</Text>
        </TouchableOpacity>

        {/* New Button to Navigate to Profile Screen */}
        <TouchableOpacity 
          style={[styles.button, styles.profileButton]} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="user" type="font-awesome-5" color="#ffffff" size={28} />
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height, // Ensuring it adapts to screen height
  },
  greetingContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.8,  // Dynamically scaling the button width
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  scanButton: {
    backgroundColor: '#4caf50', // Green
  },
  addButton: {
    backgroundColor: '#6200ea', // Purple
  },
  viewButton: {
    backgroundColor: '#3b5998', // Blue
  },
  recipeButton: {
    backgroundColor: '#f44336', // Red
  },
  nutritionButton: {
    backgroundColor: '#ff9800', // Orange
  },
  profileButton: {
    backgroundColor: '#2196f3', // Blue
  },
});

export default HomeScreen;
