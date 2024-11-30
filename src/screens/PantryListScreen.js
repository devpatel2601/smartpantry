import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Use react-native-vector-icons

import { format } from 'date-fns';  // To format expiry dates

const PantryListScreen = ({ navigation }) => {
  const [pantryItems, setPantryItems] = useState([]); // Replace with actual pantry items fetched from backend
  const [searchTerm, setSearchTerm] = useState(''); // For searching/filtering pantry items

  // Fetch pantry items (replace with actual API call)
  useEffect(() => {
    // Example pantry data (replace with data from Firebase or API)
    setPantryItems([
      { id: '1', name: 'Tomato', expiry: new Date('2024-12-01') },
      { id: '2', name: 'Milk', expiry: new Date('2024-11-21') },
      { id: '3', name: 'Cereal', expiry: new Date('2025-01-01') },
    ]);
  }, []);

  // Filter pantry items based on search term
  const filteredItems = pantryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteItem = (itemId) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setPantryItems(pantryItems.filter(item => item.id !== itemId)); // Remove item from state
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const formattedExpiry = format(item.expiry, 'MMM dd, yyyy'); // Format expiry date

    // Determine expiry status (Expired, Near Expiry, etc.)
    const isExpired = new Date(item.expiry) < new Date();
    const isNearExpiry = new Date(item.expiry) < new Date(new Date().setDate(new Date().getDate() + 3)); // 3 days before expiry

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
          <TouchableOpacity onPress={() => navigation.navigate('AddItem', { itemDetails: item })}>
            <Icon name="pencil" size={24} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search Pantry"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Pantry List */}
      <FlatList
        data={filteredItems}
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
