import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      setSuccessMessage('Logged in successfully');
      setIsToastVisible(true);
      setLoading(false);
      // Navigate to Welcome screen after successful login
      navigation.navigate('Welcome');
    } catch (error) {
      setError('Login failed. Please check your credentials');
      setLoading(false);
      console.error('Error during login: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        keyboardType="email-address"
        mode="outlined"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        secureTextEntry
        mode="outlined"
      />

      <Button
        mode="contained"
        loading={loading}
        onPress={handleLogin}
        style={styles.button}
      >
        Login
      </Button>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Snackbar
        visible={isToastVisible}
        onDismiss={() => setIsToastVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        {successMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;
