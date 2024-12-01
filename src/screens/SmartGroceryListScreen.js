import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For icons

const GroceryListScreen = () => {
  const [groceryList, setGroceryList] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [userId, setUserId] = useState(null); // Store userId

  // Fetch user ID from Firebase Auth
  useEffect(() => {
    const user = auth().currentUser; // Get the current user
    if (user) {
      setUserId(user.uid); // Set the userId when the user is logged in
    } else {
      Alert.alert('Error', 'You need to log in to access the grocery list.');
    }
  }, []);

  // Fetch grocery list data from Firestore
  useEffect(() => {
    if (userId) {
      const unsubscribe = firestore()
        .collection('grocery list')
        .where('userId', '==', userId)
        .onSnapshot(snapshot => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGroceryList(items);
        });

      return () => unsubscribe(); // Cleanup on unmount
    }
  }, [userId]); // Re-fetch data when userId changes

  // Add new item to Firestore
  const handleAddItem = async () => {
    if (!newItem.trim()) {
      Alert.alert('Error', 'Please enter an item name.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'You need to log in to add items.');
      return;
    }

    try {
      await firestore().collection('grocery list').add({
        items: newItem.trim(),
        userId,
      });
      setNewItem('');
      Alert.alert('Success', 'Item added to the grocery list.');
    } catch (error) {
      console.error('Error adding item: ', error);
      Alert.alert('Error', 'Failed to add item.');
    }
  };

  // Delete an item from Firestore
  const handleDeleteItem = async (id) => {
    try {
      await firestore().collection('grocery list').doc(id).delete();
      Alert.alert('Success', 'Item removed from the grocery list.');
    } catch (error) {
      console.error('Error deleting item: ', error);
      Alert.alert('Error', 'Failed to remove item.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemText}>{item.items}</Text>
      <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.iconButton}>
        <Ionicons name="trash-bin" size={24} color="#FF6347" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Grocery List</Text>

      {/* Input for adding new items */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new item"
          value={newItem}
          onChangeText={setNewItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Display Grocery List */}
      <FlatList
        data={groceryList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  iconButton: {
    padding: 5,
  },
});

export default GroceryListScreen;
