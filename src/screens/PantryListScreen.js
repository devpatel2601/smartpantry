import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import firestore from '@react-native-firebase/firestore'; // Correct import for firestore
import auth from '@react-native-firebase/auth'; // Ensure Firebase Auth is properly configured
import { Timestamp } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
const PantryListScreen = ({ navigation }) => {
  const [pantryItems, setPantryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the current logged-in user's ID
  const userId = auth().currentUser?.uid;
  const navigateToScanner = () => {
    navigation.navigate('Scanner'); // Make sure 'ScannerScreen' matches the name in your navigator
  };
  // Fetch pantry items when component mounts or userId changes
  useEffect(() => {
    const fetchPantryItems = async () => {
      if (!userId) {
        setError('User is not logged in.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Set loading to true while fetching data

        // Reference the `pantryItems` collection and query by `userId`
        const pantryItemsSnapshot = await firestore()
          .collection('pantryItems')
          .where('userId', '==', userId)
          .get();

        // Extract data from snapshot and set it to state
        const items = pantryItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    const expiryA = a.expiryDate && a.expiryDate.toDate ? a.expiryDate.toDate() : new Date(0); // Default to Epoch for undefined
    const expiryB = b.expiryDate && b.expiryDate.toDate ? b.expiryDate.toDate() : new Date(0);

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
              // Delete the item from Firestore
              await firestore()
                .collection('pantryItems')
                .doc(itemId)
                .delete();

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
    const expiryDate = item.expiryDate && item.expiryDate.toDate ? item.expiryDate.toDate() : null;
    const formattedExpiry = expiryDate ? format(expiryDate, 'MMM dd, yyyy') : 'No expiry date';
  
    const isExpired = expiryDate && expiryDate < new Date();
    const isNearExpiry = expiryDate && expiryDate < new Date(new Date().setDate(new Date().getDate() + 3));
  
    return (
      <View
        style={[
          styles.itemCard,
          isExpired ? styles.expired : isNearExpiry ? styles.nearExpiry : null,
        ]}
      >
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemExpiry}>Expires on: {formattedExpiry}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddItem', { itemDetails: item })}
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
      <Button
        mode="outlined"
        onPress={navigateToScanner}
        style={[styles.button, { marginTop: 16 }]} // Adding margin for spacing
      >
        Scan Item
      </Button>
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
    color: '#000',
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
    color: '#000',
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
