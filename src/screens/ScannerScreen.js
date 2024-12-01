import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet, Linking, SafeAreaView } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const devices = useCameraDevices();
  const cameraDevice = devices.back;

  useEffect(() => {
    const getPermissions = async () => {
      const result = await check(PERMISSIONS.ANDROID.CAMERA); // Check the camera permission
      if (result === RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        const requestResult = await request(PERMISSIONS.ANDROID.CAMERA); // Request permission if not granted
        setHasPermission(requestResult === RESULTS.GRANTED);
      }
      setLoading(false);
    };

    getPermissions();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <Button
          title="Go to Settings"
          onPress={() => {
            Linking.openSettings().catch((err) => {
              console.error('Failed to open settings:', err);
              Alert.alert('Error', 'Unable to open settings.');
            });
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      {cameraDevice && (
        <Camera
          style={styles.camera}
          device={cameraDevice}
          isActive={true}
          
          
        >
          <View style={styles.scanFrame}>
            <Text style={styles.scanText}>Align the barcode inside the frame</Text>
          </View>
        </Camera>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  scanFrame: {
    width: '80%',
    height: 200,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scanText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ScannerScreen;

