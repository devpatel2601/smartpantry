// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProfileScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Simulate checking user authentication status
    const checkLoginStatus = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setIsLoggedIn(true);
        setUserName(storedUser);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    // Simulate login functionality (e.g., Firebase login)
    const user = 'John Doe'; // Replace with actual login logic
    AsyncStorage.setItem('user', user);
    setIsLoggedIn(true);
    setUserName(user);
  };

  const handleLogout = () => {
    // Simulate logout functionality
    AsyncStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {isLoggedIn ? (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Welcome, {userName}!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <View style={styles.loginSection}>
          <Button title="Login" onPress={handleLogin} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    marginBottom: 20,
  },
  loginSection: {
    marginTop: 20,
  },
});

export default ProfileScreen;
