// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, Alert, ActivityIndicator, StyleSheet, Linking } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// const ScannerScreen = () => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const devices = useCameraDevices();
//   const cameraDevice = devices.back;

//   useEffect(() => {
//     const getPermissions = async () => {
//       const result = await check(PERMISSIONS.ANDROID.CAMERA); // Check the camera permission
//       if (result === RESULTS.GRANTED) {
//         setHasPermission(true);
//       } else {
//         const requestResult = await request(PERMISSIONS.ANDROID.CAMERA); // Request permission if not granted
//         setHasPermission(requestResult === RESULTS.GRANTED);
//       }
//       setLoading(false);
//     };

//     getPermissions();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text style={styles.loadingText}>Loading Camera...</Text>
//       </View>
//     );
//   }

//   if (!hasPermission) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>No access to camera</Text>
//         <Button
//           title="Go to Settings"
//           onPress={() => {
//             Linking.openSettings().catch((err) => {
//               console.error('Failed to open settings:', err);
//               Alert.alert('Error', 'Unable to open settings.');
//             });
//           }}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {cameraDevice && (
//         <Camera
//           style={styles.camera}
//           device={cameraDevice}
//           isActive={true}
//           photo={false}
//         >
//           <View style={styles.scanFrame}>
//             <Text style={styles.scanText}>Align the barcode inside the frame</Text>
//           </View>
//         </Camera>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   loadingText: {
//     color: '#fff',
//     fontSize: 16,
//     marginTop: 10,
//   },
//   permissionText: {
//     color: '#fff',
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   camera: {
//     flex: 1,
//     width: '100%',
//   },
//   scanFrame: {
//     width: '80%',
//     height: 200,
//     borderWidth: 2,
//     borderColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   },
//   scanText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });

// export default ScannerScreen;
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';

export default function ScannerScreen() {
  const [cameraPermission, setCameraPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13]);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setCameraPermission(status === 'authorized');
    })();
  }, []);

  // Handle scanned barcodes
  useEffect(() => {
    if (barcodes.length > 0) {
      const barcode = barcodes[0].displayValue;
      if (barcode) {
        Alert.alert('Barcode Scanned', `Value: ${barcode}`);
      }
    }
  }, [barcodes]);

  if (!cameraPermission) {
    return (
      <View style={styles.center}>
        <Text>Camera permission is required to scan QR codes.</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Align the barcode within the frame</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
