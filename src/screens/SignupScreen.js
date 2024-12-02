import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Icon } from 'react-native-elements';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your Firebase web client ID
});

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [diet, setDiet] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name || !diet) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setLoading(true);
    try {
      // Create user with Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      // Save user data in Firestore under the 'users' collection
      await firestore().collection('users').doc(userId).set({
        email,
        name,
        notificationsEnabled: true,
        preferences: { diet },
      });

      setLoading(false);
      Alert.alert('Signup Successful', 'You have successfully signed up!');
      navigation.navigate('Login');
    } catch (error) {
      setLoading(false);
      Alert.alert('Signup Failed', error.message || 'An error occurred. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      // Get the user's Google credentials
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      const userId = userCredential.user.uid;

      // Save user data in Firestore (if new user)
      const userDoc = await firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        const userEmail = userCredential.user.email;
        const userName = userCredential.user.displayName || 'Google User';

        await firestore().collection('users').doc(userId).set({
          email: userEmail,
          name: userName,
          notificationsEnabled: true,
          preferences: { diet: 'Not specified' }, // Default diet preference
        });
      }

      setLoading(false);
      Alert.alert('Signup Successful', 'You have successfully signed up with Google!');
      navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      Alert.alert('Google Signup Failed', error.message || 'Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#4caf50', '#81c784']} style={styles.container}>
      <Image
        source={{
          uri: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/55/48/c9/5548c982-5dc2-15b4-6bfc-518cb61173b0/AppIcon-0-0-1x_U007epad-0-0-0-0-0-85-220.png',
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Diet Preference"
        value={diet}
        onChangeText={setDiet}
      />

      {/* Signup Button */}
      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignup}
        disabled={loading}>
        <Text style={styles.signupButtonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      {/* Google Signup Button */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignUp}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <>
            <Icon name="google" type="font-awesome" color="#fff" size={20} />
            <Text style={styles.googleButtonText}>Sign Up with Google</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Link to Login screen */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.loginLink}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  signupButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#757575',
    fontSize: 18,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#DB4437',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SignupScreen;
