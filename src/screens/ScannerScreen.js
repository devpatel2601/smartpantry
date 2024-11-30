import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera'; // Import the Camera component from react-native-vision-camera

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState(null);

  const devices = useCameraDevices();
  const cameraDevice = devices.back; // Use the back camera

  // Request camera permissions on component mount
  useEffect(() => {
    const getPermissions = async () => {
      const permission = await Camera.requestCameraPermission();  // Request permission for camera access
      setHasPermission(permission === 'authorized');
      setLoading(false); // Stop loading when permission request is complete
    };
    getPermissions();
  }, []);

  // Handle barcode scanning
  const handleBarcodeScan = (scanResult) => {
    setScanned(true);
    Alert.alert('Barcode scanned!', `Data: ${scanResult?.barcodes[0]?.data}`);
  };

  // Show loading indicator while waiting for camera permission
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Camera...</Text>
      </View>
    );
  }

  // If camera permission is not granted, show a message
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cameraDevice && (
        <Camera
          style={styles.camera}
          device={cameraDevice}
          isActive={true}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScan}  // Disable scan handler when a barcode is scanned
          photo={false}
        >
          <View style={styles.scanFrame}>
            <Text style={styles.scanText}>Align the barcode inside the frame</Text>
          </View>
        </Camera>
      )}
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
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
