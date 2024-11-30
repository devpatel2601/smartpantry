import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';

const AddItemScreen = ({ route, navigation }) => {
  const { itemDetails } = route.params || {}; // Get data passed from ScannerScreen
  const [itemName, setItemName] = useState(itemDetails?.name || '');
  const [expiryDate, setExpiryDate] = useState(itemDetails?.expiry ? new Date(itemDetails.expiry) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for UI feedback
  const [error, setError] = useState(''); // Error state for input validation
  const [successMessage, setSuccessMessage] = useState(''); // Success toast message
  const [isToastVisible, setIsToastVisible] = useState(false); // Show success toast

  // New states for nutritional info and carbon footprint
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbonFootprint, setCarbonFootprint] = useState('');

  // Assuming userId is available via Firebase Authentication
  const userId = 'userID1'; // Replace with actual user ID from Firebase Authentication

  const addItem = async () => {
    if (!itemName || !expiryDate || !calories || !protein || !fat || !carbonFootprint) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true); // Show loading while saving

    const pantryItem = {
      name: itemName,
      expiryDate: expiryDate,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      carbonFootprint: parseFloat(carbonFootprint),
      userId: userId,
    };

    try {
      // Add item to Firestore
      await firestore()
        .collection('users')
        .doc(userId) // Assuming each user has a document in the 'users' collection
        .update({
          pantry: firestore.FieldValue.arrayUnion(pantryItem),
        });

      setLoading(false);
      setSuccessMessage('Item successfully added!');
      setIsToastVisible(true);

      // Navigate to PantryList with the new item
      navigation.navigate('PantryList', { newItem: pantryItem });
    } catch (error) {
      setLoading(false);
      setError('Error adding item. Please try again.');
      console.error('Error adding pantry item:', error);
    }
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

      {/* Nutritional Information Inputs */}
      <TextInput
        label="Calories"
        value={calories}
        onChangeText={(text) => setCalories(text)}
        style={[styles.input, error ? styles.inputError : null]}
        mode="outlined"
        keyboardType="numeric"
      />
      <TextInput
        label="Protein (g)"
        value={protein}
        onChangeText={(text) => setProtein(text)}
        style={[styles.input, error ? styles.inputError : null]}
        mode="outlined"
        keyboardType="numeric"
      />
      <TextInput
        label="Fat (g)"
        value={fat}
        onChangeText={(text) => setFat(text)}
        style={[styles.input, error ? styles.inputError : null]}
        mode="outlined"
        keyboardType="numeric"
      />

      {/* Carbon Footprint Input */}
      <TextInput
        label="Carbon Footprint (kg)"
        value={carbonFootprint}
        onChangeText={(text) => setCarbonFootprint(text)}
        style={[styles.input, error ? styles.inputError : null]}
        mode="outlined"
        keyboardType="numeric"
      />

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
