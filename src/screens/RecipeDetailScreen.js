import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params; // Get the recipe data passed from RecipeSuggestionsScreen

  const handleAddToPantry = () => {
    Alert.alert(
      'Add to Pantry',
      'Do you want to add the ingredients of this recipe to your pantry?',
      [
        { text: 'Cancel' },
        { text: 'Add', onPress: () => console.log('Ingredients added to pantry!') }, // Logic to add ingredients to pantry
      ]
    );
  };

  const renderIngredients = (ingredients) => {
    return ingredients.split(',').map((ingredient, index) => (
      <Text key={index} style={styles.ingredientItem}>
        - {ingredient.trim()}
      </Text>
    ));
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

      {/* Add to Pantry Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToPantry}>
        <Text style={styles.addButtonText}>Add Ingredients to Pantry</Text>
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
