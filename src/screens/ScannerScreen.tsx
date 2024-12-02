
import * as React from 'react'
import { useCallback, useRef, useState } from 'react'
import type { AlertButton } from 'react-native'
import { Alert, Linking, StyleSheet, View } from 'react-native'
import type { Code } from 'react-native-vision-camera'
import { useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
import { CONTENT_SPACING, CONTROL_BUTTON_SIZE, SAFE_AREA_PADDING } from './Constants.tsx'
import { useIsForeground } from './hooks/useIsForeground.tsx'
import { StatusBarBlurBackground } from './views/StatusBarBlurBackground.tsx'
import { PressableOpacity } from 'react-native-pressable-opacity'
import IonIcon from 'react-native-vector-icons/Ionicons'
import type { Routes } from './Routes.tsx'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useIsFocused } from '@react-navigation/core'
import firestore from '@react-native-firebase/firestore'
import  auth  from '@react-native-firebase/auth'
import debounce from 'lodash.debounce';


const showCodeAlert = (value: string, onDismissed: () => void): void => {
  const buttons: AlertButton[] = [
    {
      text: 'Close',
      style: 'cancel',
      onPress: onDismissed,
    },
  ]
  if (value.startsWith('http')) {
    buttons.push({
      text: 'Open URL',
      onPress: () => {
        Linking.openURL(value)
        onDismissed()
      },
    })
  }
  Alert.alert('Scanned Code', value, buttons)
}


type Props = NativeStackScreenProps<Routes, 'CodeScannerPage'>
export function ScannerScreen({ navigation }: Props): React.ReactElement {
  // 1. Use a simple default back camera
  const device = useCameraDevice('back')

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocused && isForeground

  // 3. (Optional) enable a torch setting
  const [torch, setTorch] = useState(false)

  // 4. On code scanned, we show an aler to the user
  const isShowingAlert = useRef(false)
  // const onCodeScanned = useCallback((codes: Code[]) => {
  //   console.log(`Scanned ${codes.length} codes:`, codes)
  //   const value = codes[0]?.value
  //   if (value == null) return
  //   if (isShowingAlert.current) return
  //   showCodeAlert(value, () => {
  //     isShowingAlert.current = false
  //   })
  //   isShowingAlert.current = true
  // }, [])
  const onCodeScanned = useCallback(
    debounce(async (codes: Code[]) => {
      if (codes.length === 0 || isShowingAlert.current) return;
  
      const value = codes[0]?.value;
      if (!value || typeof value !== 'string') {
        isShowingAlert.current = false;
        return;
      }
  
      try {
        isShowingAlert.current = true; // Lock further scans
  
        console.log('Scanned value:', value);
  
        // Fetch product details
        const response = await fetch(`http://192.168.255.138:3000/api/products/${value}`);
        console.log('Backend response status:', response.status);
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch product data: ${errorText}`);
        }
  
        const productData = await response.json();
        console.log('Product data:', productData);
  
        const currentUserId = auth().currentUser?.uid || null;
  
        if (!currentUserId) {
          Alert.alert('Error', 'You must be logged in to add items.');
          isShowingAlert.current = false;
          return;
        }
  
        const pantryItem = {
          name: productData.name || 'N/A',
          brand: productData.brand || 'N/A',
          ingredients: productData.ingredients || 'N/A',
          expiryDate: null, // User to input manually
          quantity: productData.quantity ?? 1,
          price: productData.price ?? 0,
          userId: currentUserId,
        };
  
        // // Save to Firestore
        // await firestore().collection('pantryItems').add(pantryItem);
        // console.log('Item added to pantry successfully');
  
        // Navigate to Add Item screen
        navigation.navigate('AddItem', { pantryItem });
      } catch (error) {
        console.error('Error fetching product details:', error);
        Alert.alert('Error', 'Unable to fetch product details.', [
          { text: 'OK', onPress: () => (isShowingAlert.current = false) },
        ]);
      } finally {
        isShowingAlert.current = false; // Unlock scanning after processing
      }
    }, 1000), // Debounce with 1-second delay
    [navigation, isShowingAlert]
  );


  // 5. Initialize the Code Scanner to scan QR codes and Barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: onCodeScanned,
  })

  return (
    <View style={styles.container}>
      {device != null && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          torch={torch ? 'on' : 'off'}
          enableZoomGesture={true}
        />
      )}

      <StatusBarBlurBackground />

      <View style={styles.rightButtonRow}>
        <PressableOpacity style={styles.button} onPress={() => setTorch(!torch)} disabledOpacity={0.4}>
          <IonIcon name={torch ? 'flash' : 'flash-off'} color="white" size={24} />
        </PressableOpacity>
      </View>

      {/* Back Button */}
      <PressableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <IonIcon name="chevron-back" color="white" size={35} />
      </PressableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  backButton: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
})

export default ScannerScreen;
