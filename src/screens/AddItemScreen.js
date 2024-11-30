
import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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



const userId = auth().currentUser?.uid; // Get the authenticated user's ID
console.log('User ID:', userId); 

const addItem = async () => {
  if (!itemName || !expiryDate || !category || !price || !quantity) {
    setError('Please fill out all fields.');
    return;
  }

  const safeItemName = itemName || 'Unknown Item';
  const safeCategory = category || 'Uncategorized';
  const safeExpiryDate = expiryDate || new Date();
  const safePrice = price !== undefined && price !== null ? parseFloat(price) : 0;
  const safeQuantity = quantity !== undefined && quantity !== null ? parseInt(quantity) : 0;
  const safeUserId = userId || 'Unknown User';

  setLoading(true); // Show loading while saving

  const pantryItem = {
    category: safeCategory,
    name: safeItemName,
    expiryDate: safeExpiryDate,
    price: safePrice,
    quantity: safeQuantity,
    userId: safeUserId,
  };

  try {
    // Check if the user's document exists. If not, create it.
    const userDocRef = firestore().collection('users').doc(userId);

    const docSnapshot = await userDocRef.get();

    if (!docSnapshot.exists) {
      // If the user document doesn't exist, create it
      console.log('User document does not exist, creating new document');
      await userDocRef.set({
        pantry: [pantryItem],  // Create pantry array with the first item
      });
    } else {
      // If it exists, just update the pantry array
      console.log('User document exists, updating pantry array');
      await userDocRef.update({
        pantry: firestore.FieldValue.arrayUnion(pantryItem),
      });
    }

    setLoading(false);
    setSuccessMessage('Item successfully added!');
    setIsToastVisible(true);

    // Navigate to PantryList with the new item
    navigation.navigate('PantryList', { newItem: pantryItem });
  } catch (error) {
    setLoading(false);
    setError('Error adding item. Please try again.');
    console.error('Error adding pantry item:', error);  // Log the error to the console
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
