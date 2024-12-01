import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddItemScreen = ({ route, navigation }) => {
  const { itemDetails } = route.params || {}; // Data passed for editing items
  const [itemName, setItemName] = useState(itemDetails?.name || '');
  const [expiryDate, setExpiryDate] = useState(itemDetails?.expiryDate ? new Date(itemDetails.expiryDate) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for UI feedback
  const [error, setError] = useState(''); // Error state for input validation
  const [successMessage, setSuccessMessage] = useState(''); // Success toast message
  const [isToastVisible, setIsToastVisible] = useState(false); // Show success toast

  // Nutritional info and carbon footprint
  const [calories, setCalories] = useState(itemDetails?.calories || '');
  const [protein, setProtein] = useState(itemDetails?.protein || '');
  const [fat, setFat] = useState(itemDetails?.fat || '');
  const [carbonFootprint, setCarbonFootprint] = useState(itemDetails?.carbonFootprint || '');

  // Additional fields
  const [category, setCategory] = useState(itemDetails?.category || '');
  const [price, setPrice] = useState(itemDetails?.price?.toString() || '');
  const [quantity, setQuantity] = useState(itemDetails?.quantity?.toString() || '');

  const userId = auth().currentUser?.uid; // Get the authenticated user's ID

  if (!userId) {
    Alert.alert('Error', 'You must be logged in to add items.');
    navigation.navigate('Login');
    return null;
  }

  const addItem = async () => {
    if (!itemName || !expiryDate || !category || !price || !quantity) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError('');

    const pantryItem = {
      name: itemName,
      expiryDate: expiryDate.toISOString(),
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      userId,
      calories: parseFloat(calories) || null,
      protein: parseFloat(protein) || null,
      fat: parseFloat(fat) || null,
      carbonFootprint: parseFloat(carbonFootprint) || null,
    };

    try {
      const pantryRef = firestore().collection('pantryItems');

      if (itemDetails?.id) {
        // Update existing item
        await pantryRef.doc(itemDetails.id).update(pantryItem);
        setSuccessMessage('Item updated successfully!');
      } else {
        // Add new item
        await pantryRef.add(pantryItem);
        setSuccessMessage('Item added successfully!');
      }

      setIsToastVisible(true);
      setLoading(false);

      // Navigate back to the Pantry List screen
      navigation.navigate('PantryList');
    } catch (error) {
      console.error('Error adding item:', error);
      setLoading(false);
      setError('Error adding item. Please try again.');
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
      <Text style={styles.title}>{itemDetails ? 'Edit Item' : 'Add Item'}</Text>

      <TextInput
        label="Item Name"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
        mode="outlined"
        autoCapitalize="words"
      />

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

      <TextInput label="Category" value={category} onChangeText={setCategory} style={styles.input} mode="outlined" />
      <TextInput
        label="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />
      <TextInput
        label="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />

      <TextInput
        label="Calories"
        value={calories}
        onChangeText={setCalories}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />
      <TextInput
        label="Protein (g)"
        value={protein}
        onChangeText={setProtein}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />
      <TextInput
        label="Fat (g)"
        value={fat}
        onChangeText={setFat}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />
      <TextInput
        label="Carbon Footprint (kg)"
        value={carbonFootprint}
        onChangeText={setCarbonFootprint}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />

      <Button mode="contained" onPress={addItem} style={styles.button} loading={loading} disabled={loading}>
        {itemDetails ? 'Update Item' : 'Add Item'}
      </Button>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
