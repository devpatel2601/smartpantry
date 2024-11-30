// RecipeSuggestionsScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const RecipeSuggestionsScreen = ({ navigation }) => {
  const recipes = [
    { 
      id: '1', 
      name: 'Pasta', 
      description: 'Easy pasta recipe', 
      image: 'https://via.placeholder.com/150',
      ingredients: 'Pasta, tomato sauce, olive oil, garlic', 
      instructions: 'Cook pasta, prepare sauce, mix together'
    },
    { 
      id: '2', 
      name: 'Salad', 
      description: 'Fresh vegetable salad', 
      image: 'https://via.placeholder.com/150',
      ingredients: 'Lettuce, cucumber, tomatoes, dressing',
      instructions: 'Chop ingredients, mix, and serve'
    },
  ];

  const handlePress = (recipe) => {
    navigation.navigate('RecipeDetail', { recipe }); // Pass recipe data to RecipeDetailScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes for You</Text>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeItem} onPress={() => handlePress(item)}>
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{item.name}</Text>
              <Text style={styles.recipeDescription}>{item.description}</Text>
              <TouchableOpacity style={styles.favoriteButton}>
                <Icon name="heart" type="font-awesome" color="white" size={20} />
                <Text style={styles.favoriteButtonText}>Favorite</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  recipeItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5, // Shadow for iOS
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    marginTop: 10,
    elevation: 3,
  },
  favoriteButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
});

export default RecipeSuggestionsScreen;
