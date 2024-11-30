// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebaseConfig'; // Import auth from firebaseConfig
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email && password) {
      setLoading(true);
      try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password); // Sign in with Firebase
        const user = userCredential.user;
        // Save user data to AsyncStorage after successful login
        await AsyncStorage.setItem('user', user.email);
        Alert.alert('Login Successful', 'Welcome back!');
        navigation.navigate('Home'); // Navigate to the home screen
      } catch (error) {
        console.error(error.message);
        Alert.alert('Login Failed', 'Please check your credentials and try again.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Input Error', 'Please enter both email and password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={loading ? "Logging In..." : "Login"} onPress={handleLogin} />
      <Button title="Go to Sign Up" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
});

export default LoginScreen;
