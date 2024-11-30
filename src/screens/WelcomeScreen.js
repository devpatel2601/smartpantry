import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Install via `react-native-linear-gradient`
import Icon from 'react-native-vector-icons/Ionicons'; // Install via `react-native-vector-icons`

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient colors={['#4caf50', '#81c784']} style={styles.container}>
      <Image
        source={{
          uri: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/55/48/c9/5548c982-5dc2-15b4-6bfc-518cb61173b0/AppIcon-0-0-1x_U007epad-0-0-0-0-0-85-220.png/1200x600wa.png',
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to PantryPro!</Text>
      <Text style={styles.subtitle}>Your smart pantry management assistant</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-forward-circle-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388e3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});
