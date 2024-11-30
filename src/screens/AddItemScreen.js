import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddItemScreen = ({ route, navigation }) => {
  const { itemDetails } = route.params || {}; // Get data passed from ScannerScreen
  const [itemName, setItemName] = useState(itemDetails?.name || '');
  const [expiryDate, setExpiryDate] = useState(itemDetails?.expiry ? new Date(itemDetails.expiry) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for UI feedback
  const [error, setError] = useState(''); // Error state for input validation
  const [successMessage, setSuccessMessage] = useState(''); // Success toast message
  const [isToastVisible, setIsToastVisible] = useState(false); // Show success toast

  const addItem = () => {
    if (!itemName || !expiryDate) {
      setError('Please enter both the item name and expiry date.');
      return;
    }

    setLoading(true); // Show loading while saving
    console.log(`Item Added: ${itemName}, Expiry: ${expiryDate.toLocaleDateString()}`);
    
    // Firebase integration here to save the item in the database
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Item successfully added!');
      setIsToastVisible(true);
      navigation.navigate('PantryList', { newItem: { name: itemName, expiryDate } });
    }, 2000); // Mock save delay
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Item</Text>
      
      {/* Item Name Input */}
      <TextInput
        label="Item Name"
        value={itemName}
        onChangeText={(text) => setItemName(text)}
        style={[styles.input, error ? styles.inputError : null]}
        mode="outlined"
        autoCapitalize="words"
      />
      
      {/* Expiry Date Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
        <Text style={styles.dateText}>
          {expiryDate ? expiryDate.toLocaleDateString() : 'Select Expiry Date'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={expiryDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Add Item Button */}
      <Button
        mode="contained"
        onPress={addItem}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Add Item
      </Button>

      {/* Input Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Success Toast Message */}
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 20,
  },
  inputError: {
    borderColor: 'red',
  },
  dateInput: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
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

export default AddItemScreen;
