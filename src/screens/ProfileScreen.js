// ProfileScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Settings</Text>
      <Button title="Edit Profile" onPress={() => {}} />
      <Button title="Notifications" onPress={() => {}} />
      <Button title="Data Management" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
});

export default ProfileScreen;
