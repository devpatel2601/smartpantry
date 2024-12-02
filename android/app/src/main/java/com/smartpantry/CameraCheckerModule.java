package com.smartpantry;

import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraManager;
import android.content.Context;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class CameraCheckerModule extends ReactContextBaseJavaModule {
    public CameraCheckerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CameraChecker";
    }

    @ReactMethod
    public void checkCamera2Support(Promise promise) {
        CameraManager cameraManager = (CameraManager) getReactApplicationContext().getSystemService(Context.CAMERA_SERVICE);
        try {
            for (String cameraId : cameraManager.getCameraIdList()) {
                CameraCharacteristics characteristics = cameraManager.getCameraCharacteristics(cameraId);
                Integer level = characteristics.get(CameraCharacteristics.INFO_SUPPORTED_HARDWARE_LEVEL);
                if (level != null && level != CameraCharacteristics.INFO_SUPPORTED_HARDWARE_LEVEL_LEGACY) {
                    promise.resolve(true); // Camera2 supported
                    return;
                }
            }
            promise.resolve(false); // No Camera2 support
        } catch (Exception e) {
            promise.reject("Camera2_Check_Error", e);
        }
    }
}
