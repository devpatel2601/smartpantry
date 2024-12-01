import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch notifications
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const today = moment();
        const twoDaysLater = moment().add(2, 'days');
        const oneDayLater = moment().add(1, 'day');

        // Get all pantry items
        const pantryItemsSnapshot = await firestore().collection('pantryItems').get();

        const newNotifications = [];

        pantryItemsSnapshot.forEach((doc) => {
          const itemData = doc.data();
          const expiryDate = moment(itemData.expiryDate.toDate());

          // Check if expiry date is 2 days later, 1 day later, or today
          if (
            expiryDate.isSame(twoDaysLater, 'day') ||
            expiryDate.isSame(oneDayLater, 'day') ||
            expiryDate.isSame(today, 'day')
          ) {
            // Add a new notification
            newNotifications.push({
              id: doc.id,
              itemId: itemData.name,
              expiryDate: itemData.expiryDate,
            });
          }
        });

        setNotifications(newNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        Alert.alert('Error', 'Unable to fetch notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (item) => {
    // Navigate to the item details or perform other actions on notification click
    Alert.alert('Notification Clicked', `Item: ${item.itemId} is about to expire on ${item.expiryDate.toDate()}`);
  };

  const handleClearNotification = async (id) => {
    try {
      // Update the notification as 'sent' after it's been acknowledged
      await firestore()
        .collection('notifications')
        .doc(id)
        .update({ sent: true });

      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error clearing notification:', error);
      Alert.alert('Error', 'Unable to clear the notification. Please try again later.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderNotification = ({ item }) => {
    return (
      <View style={styles.notificationItem}>
        <View style={styles.notificationContent}>
          <Icon name="alert-circle-outline" size={30} color="#f44336" />
          <View style={styles.notificationText}>
            <Text style={styles.notificationTitle}>Item Expiry Alert</Text>
            <Text style={styles.notificationDetails}>
              {item.itemId} is about to expire on {item.expiryDate.toDate().toLocaleString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => handleClearNotification(item.id)}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expiry Notifications</Text>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noNotificationsText}>No upcoming expiry notifications</Text>
      )}

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
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    marginLeft: 10,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  notificationDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  clearButton: {
    backgroundColor: '#f44336',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
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
  noNotificationsText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificationScreen;
