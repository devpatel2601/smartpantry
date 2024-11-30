import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import { firestore } from '../firebase'; // Ensure Firebase Firestore is properly configured
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import auth from '@react-native-firebase/auth'; // Ensure Firebase Auth is properly configured

const PantryListScreen = ({ navigation }) => {
  const [pantryItems, setPantryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the current logged-in user's ID
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const fetchPantryItems = async () => {
      if (!userId) {
        setError('User is not logged in.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Set loading to true while fetching data

        // Reference the user's document in the `users` collection
        const userDocRef = doc(firestore, 'users', userId);

        // Reference the `pantryItems` subcollection
        const pantryItemsRef = collection(userDocRef, 'pantryItems');

        // Fetch all documents from the `pantryItems` subcollection
        const pantryItemsSnapshot = await getDocs(pantryItemsRef);

        const items = pantryItemsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPantryItems(items);
      } catch (error) {
        console.error('Error fetching pantry items:', error);
        setError('Failed to fetch pantry items.');
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchPantryItems();
  }, [userId]);

  // Filter pantry items based on search term
  const filteredItems = pantryItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort pantry items by expiry status
  const sortedItems = filteredItems.sort((a, b) => {
    const expiryA = new Date(a.expiryDate);
    const expiryB = new Date(b.expiryDate);

    const now = new Date();
    const isNearExpiryA = expiryA < new Date(now.setDate(now.getDate() + 3));
    const isNearExpiryB = expiryB < new Date(now.setDate(now.getDate() + 3));

    if (isNearExpiryA && !isNearExpiryB) return -1;
    if (!isNearExpiryA && isNearExpiryB) return 1;
    return expiryA - expiryB;
  });

  // Handle deleting an item from the pantry
  const handleDeleteItem = async (itemId) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const userDocRef = doc(firestore, 'users', userId);
              const pantryItemsRef = collection(userDocRef, 'pantryItems');
              const itemDocRef = doc(pantryItemsRef, itemId);

              // Delete the item from Firestore
              await deleteDoc(itemDocRef);

              // Remove the item from the state
              setPantryItems(pantryItems.filter((item) => item.id !== itemId));
            } catch (error) {
              console.error('Error deleting pantry item:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const formattedExpiry = format(new Date(item.expiryDate), 'MMM dd, yyyy');

    // Determine the item's expiry status
    const isExpired = new Date(item.expiryDate) < new Date();
    const isNearExpiry = new Date(item.expiryDate) < new Date(new Date().setDate(new Date().getDate() + 3));

    return (
      <View style={[styles.itemCard, isExpired ? styles.expired : isNearExpiry ? styles.nearExpiry : null]}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemExpiry}>Expires on: {formattedExpiry}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddItemScreen', { itemDetails: item })}
          >
            <Icon name="pencil" size={24} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return <Text>{error || 'Loading pantry items...'}</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Pantry"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={sortedItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  expired: {
    backgroundColor: '#f8d7da',
  },
  nearExpiry: {
    backgroundColor: '#fff3cd',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemExpiry: {
    fontSize: 14,
    color: '#777',
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default PantryListScreen;
