import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Ensure this import is correct
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Get screen width and height
const { width, height } = Dimensions.get('window');

// Reusable IconButton Component
const IconButton = ({ name, color, size }) => {
  return <Icon name={name} color={color} size={size} />;
};

const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState(''); // State to hold the username

  // Fetch username from Firestore or Firebase Authentication
  useEffect(() => {
    const fetchUsername = async () => {
      const userId = auth().currentUser?.uid;

      if (userId) {
        try {
          // Fetch the user's name from the 'users' collection (if you store it there)
          const userDoc = await firestore().collection('users').doc(userId).get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setUsername(userData?.name || 'User'); // Set the username
          } else {
            setUsername('User'); // Fallback if no name is found
          }
        } catch (error) {
          console.error('Error fetching username:', error);
          setUsername('User'); // Fallback
        }
      } else {
        setUsername('User'); // Fallback if no user is logged in
      }
    };

    fetchUsername();
  }, []); // Only fetch once when the component mounts

  // Greeting message based on the time of the day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      {/* Background Image or Color */}
      <Image
        source={{
          uri: 'https://your-image-url.jpg',  // Replace with an actual image URL
        }}
        style={styles.backgroundImage}
      />

      {/* Notification Icon */}
      <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('Notifications')}>
        <IconButton name="bell" color="#ffffff" size={30} />
      </TouchableOpacity>

      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>{getGreeting()}, {username}!</Text>
        <Text style={styles.subtitle}>What would you like to do today?</Text>
      </View>

      {/* Action Buttons Container */}
      <View style={styles.buttonContainer}>
        {/* Row 1 */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => navigation.navigate('Scanner')}
          >
            <IconButton name="plus-circle" color="#ffffff" size={28} />
            <Text style={styles.buttonText}>Scan Item</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => navigation.navigate('AddItem')}
          >
            <IconButton name="plus-circle" color="#ffffff" size={28} />
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => navigation.navigate('PantryList')}
          >
            <IconButton name="list-alt" color="#ffffff" size={28} />
            <Text style={styles.buttonText}>View Pantry</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => navigation.navigate('RecipeSuggestions')}
          >
            <IconButton name="utensils" color="#ffffff" size={28} />
            <Text style={styles.buttonText}>Find Recipes</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => navigation.navigate('NutritionalAnalysis')}
          >
            <IconButton name="apple-alt" color="#ffffff" size={28} />
            <Text style={styles.buttonText}>Nutritional Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => navigation.navigate('Grocery')}
          >
            <IconButton name="user" color="#ffffff" size={28} />
            <Text style={styles.buttonText}>Grocery List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center',
    minHeight: height, // Ensuring it adapts to screen height
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    opacity: 0.2,  // Slight opacity to let UI elements stand out
  },
  notificationIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#4caf50',
    borderRadius: 50,
    padding: 10,
  },
  greetingContainer: {
    marginTop: 80,
    marginBottom: 40,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'grey', // White text for better contrast on dark background
  },
  subtitle: {
    fontSize: 16,
    color: 'black', // White subtitle
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center', // Centers buttons horizontally
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20, // Adds some spacing between rows
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: width * 0.4,  // Adjust button width to fit two per row
    elevation: 5, // Adds shadow for better button visibility
  },
  buttonText: {
    color: '#ffffff', // White text on buttons
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 10,
  },
  primaryButton: {
    backgroundColor: '#4caf50', // Green button color for all buttons
  },
});

export default HomeScreen;
