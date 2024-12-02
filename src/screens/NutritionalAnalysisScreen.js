import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const NutritionalAnalysisScreen = ({ navigation }) => {
  const [nutritionalData, setNutritionalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = auth().currentUser?.uid;

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!userId) {
        throw new Error('User not logged in.');
      }

      // Fetch pantry items for the user
      const pantryItemsSnapshot = await firestore()
        .collection('pantryItems')
        .where('userId', '==', userId)
        .get();

      if (pantryItemsSnapshot.empty) {
        throw new Error('No pantry items found for this user.');
      }

      // Extract item names from pantry items
      const itemNames = pantryItemsSnapshot.docs.map(doc => doc.data().name);

      // Fetch nutritional data for each item
      const nutritionalDataPromises = itemNames.map(async (itemName) => {
        const nutritionalSnapshot = await firestore()
          .collection('nutritional_data')
          .doc(itemName)
          .get();

        if (!nutritionalSnapshot.exists) {
          return {
            calories: 0,
            protein: 0,
            fat: 0,
            carbonFootprint: 0,
          };
        }

        return nutritionalSnapshot.data();
      });

      // Wait for all nutritional data to be fetched
      const allNutritionalData = await Promise.all(nutritionalDataPromises);

      // Aggregate nutritional data
      const analysis = allNutritionalData.reduce((acc, itemData) => {
        acc.calories += itemData.calories || 0;
        acc.protein += itemData.protein || 0;
        acc.fat += itemData.fat || 0;
        acc.carbonFootprint += itemData.carbonFootprint || 0;
        return acc;
      }, { calories: 0, protein: 0, fat: 0, carbonFootprint: 0 });

      setNutritionalData(analysis);
    } catch (err) {
      console.error('Error fetching nutritional data:', err);
      setError('Failed to fetch nutritional data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="grey" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutritional Analysis</Text>
      {nutritionalData && (
        <View>
          <Text>Calories: {nutritionalData.calories} kcal</Text>
          <Text>Protein: {nutritionalData.protein} g</Text>
          <Text>Fat: {nutritionalData.fat} g</Text>
          <Text>Carbon Footprint: {nutritionalData.carbonFootprint} kg</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});

export default NutritionalAnalysisScreen;
