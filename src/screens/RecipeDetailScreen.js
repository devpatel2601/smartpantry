import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params; // Get the recipe data passed from RecipeSuggestionsScreen

  // Function to handle adding ingredients to both pantry and grocery list
  const handleAddToPantryAndGroceryList = async () => {
    const userId = auth().currentUser?.uid; // Get current logged-in user ID
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to add items to your pantry and grocery list.');
      navigation.navigate('Login');
      return;
    }

    Alert.alert(
      'Add to Pantry & Grocery List',
      'Do you want to add the ingredients of this recipe to your pantry and grocery list?',
      [
        { text: 'Cancel' },
        {
          text: 'Add',
          onPress: async () => {
            try {
              const ingredients = recipe.ingredients.split(','); // Split ingredients by comma
              const batch = firestore().batch();

              // Loop through each ingredient and add it to both pantry and grocery list
              ingredients.forEach((ingredient) => {
                const trimmedIngredient = ingredient.trim();

                // Add to pantry
                const pantryRef = firestore().collection('pantryItems').doc();
                batch.set(pantryRef, {
                  name: trimmedIngredient,
                  expiryDate: null, // Optionally add expiryDate
                  quantity: 1, // Default quantity
                  category: 'Uncategorized', // Default category
                  userId,
                });

                // Add to grocery list
                const groceryListRef = firestore().collection('grocery list').doc();
                batch.set(groceryListRef, {
                  items: trimmedIngredient,
                  userId,
                });
              });

              // Commit batch operation
              await batch.commit();

              Alert.alert('Success', 'Ingredients have been added to your pantry and grocery list.');
            } catch (error) {
              console.error('Error adding ingredients to pantry and grocery list:', error);
              Alert.alert('Error', 'Could not add ingredients. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderIngredients = (ingredients) => {
    return ingredients.split(',').map((ingredient, index) => {
      const trimmedIngredient = ingredient.trim();
      return (
        <View key={index} style={styles.ingredientRow}>
          <Text style={styles.ingredientItem}>- {trimmedIngredient}</Text>
          <TouchableOpacity
            style={styles.addToPantryButton}
            onPress={() =>
              navigation.navigate('AddItem', {
                itemDetails: { name: trimmedIngredient }, // Send ingredient details
              })
            }
          >
            <Text style={styles.buttonText}>Add to Pantry</Text>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const renderInstructions = (instructions) => {
    return instructions.split('.').map((step, index) => (
      <Text key={index} style={styles.instructionItem}>
        {index + 1}. {step.trim()}
      </Text>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.description}>{recipe.description}</Text>

      {/* Ingredients Section */}
      <Text style={styles.ingredientsTitle}>Ingredients:</Text>
      <View style={styles.ingredientsContainer}>{renderIngredients(recipe.ingredients)}</View>

      {/* Instructions Section */}
      <Text style={styles.instructionsTitle}>Instructions:</Text>
      <View style={styles.instructionsContainer}>{renderInstructions(recipe.instructions)}</View>

      {/* Add to Pantry & Grocery List Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToPantryAndGroceryList}>
        <Text style={styles.addButtonText}>Add Ingredients to Pantry & Grocery List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#777',
    marginBottom: 15,
  },
  ingredientsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  ingredientsContainer: {
    marginBottom: 15,
  },
  ingredientItem: {
    fontSize: 16,
    color: '#555',
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionsContainer: {
    marginBottom: 15,
  },
  instructionItem: {
    fontSize: 16,
    color: '#555',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RecipeDetailScreen;
