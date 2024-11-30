import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Use react-native-vector-icons

const NutritionalAnalysisScreen = ({ navigation }) => {
  const nutritionalData = {
    calories: 250,
    protein: '15g',
    fat: '10g',
    carbonFootprint: '0.5kg CO2',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutritional Analysis</Text>
      
      <View style={styles.dataContainer}>
        <View style={[styles.dataItem, styles.calories]}>
          <Icon name="flame-outline" size={28} color="#ff7043" />
          <Text style={styles.dataLabel}>Calories</Text>
          <Text style={styles.dataValue}>{nutritionalData.calories} kcal</Text>
        </View>
        
        <View style={[styles.dataItem, styles.protein]}>
          <Icon name="barbell-outline" size={28} color="#42a5f5" />
          <Text style={styles.dataLabel}>Protein</Text>
          <Text style={styles.dataValue}>{nutritionalData.protein}</Text>
        </View>
        
        <View style={[styles.dataItem, styles.fat]}>
          <Icon name="water-outline" size={28} color="#66bb6a" />
          <Text style={styles.dataLabel}>Fat</Text>
          <Text style={styles.dataValue}>{nutritionalData.fat}</Text>
        </View>
        
        <View style={[styles.dataItem, styles.carbonFootprint]}>
          <Icon name="leaf-outline" size={28} color="#8d6e63" />
          <Text style={styles.dataLabel}>Carbon Footprint</Text>
          <Text style={styles.dataValue}>{nutritionalData.carbonFootprint}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  dataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dataItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dataLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  dataValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  calories: { borderColor: '#ff7043' },
  protein: { borderColor: '#42a5f5' },
  fat: { borderColor: '#66bb6a' },
  carbonFootprint: { borderColor: '#8d6e63' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default NutritionalAnalysisScreen;
