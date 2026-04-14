"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Device } from '@capacitor/device';

interface MobileCameraState {
  isNative: boolean;
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseMobileCameraReturn {
  state: MobileCameraState;
  capturePhoto: () => Promise<string | null>;
  checkPermissions: () => Promise<boolean>;
  requestPermissions: () => Promise<boolean>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function useMobileCamera(): UseMobileCameraReturn {
  const [state, setState] = useState<MobileCameraState>({
    isNative: false,
    hasPermission: false,
    isLoading: true,
    error: null,
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if running on native platform
  useEffect(() => {
    const checkPlatform = async () => {
      const info = await Device.getInfo();
      const isNative = info.platform !== 'web';
      setState(prev => ({ ...prev, isNative, isLoading: false }));
    };
    checkPlatform();
  }, []);

  // Check camera permissions
  const checkPermissions = useCallback(async (): Promise<boolean> => {
    try {
      if (state.isNative) {
        const permissions = await Camera.checkPermissions();
        const hasPermission = permissions.camera === 'granted';
        setState(prev => ({ ...prev, hasPermission }));
        return hasPermission;
      } else {
        // Web platform - check getUserMedia
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          setState(prev => ({ ...prev, hasPermission: true }));
          return true;
        } catch {
          setState(prev => ({ ...prev, hasPermission: false }));
          return false;
        }
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to check permissions' }));
      return false;
    }
  }, [state.isNative]);

  // Request camera permissions
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      if (state.isNative) {
        const permissions = await Camera.requestPermissions();
        const hasPermission = permissions.camera === 'granted';
        setState(prev => ({ ...prev, hasPermission }));
        return hasPermission;
      } else {
        return await checkPermissions();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Permission denied' }));
      return false;
    }
  }, [state.isNative, checkPermissions]);

  // Capture photo (native only)
  const capturePhoto = useCallback(async (): Promise<string | null> => {
    try {
      if (!state.isNative) {
        // Web platform - use canvas capture
        if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            return canvas.toDataURL('image/jpeg');
          }
        }
        return null;
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      return image.dataUrl || null;
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to capture photo' }));
      return null;
    }
  }, [state.isNative]);

  return {
    state,
    capturePhoto,
    checkPermissions,
    requestPermissions,
    videoRef,
  };
}
