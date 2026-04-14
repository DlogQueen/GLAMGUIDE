"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ANDROID_DEEPAR_KEY } from "@/services/deepArService";
import { Device } from '@capacitor/device';

interface MobileDeepARState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  isNative: boolean;
}

interface UseMobileDeepARReturn {
  state: MobileDeepARState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  initializeDeepAR: () => Promise<boolean>;
  switchEffect: (effectName: string) => Promise<void>;
  shutdown: () => void;
}

// DeepAR SDK types for mobile
interface DeepARAndroid {
  initialize: (licenseKey: string, canvas: HTMLCanvasElement) => Promise<void>;
  switchEffect: (effectPath: string) => Promise<void>;
  shutdown: () => void;
  onFaceDetected?: (faces: FaceData[]) => void;
}

interface FaceData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useMobileDeepAR(): UseMobileDeepARReturn {
  const [state, setState] = useState<MobileDeepARState>({
    isInitialized: false,
    isLoading: false,
    error: null,
    isNative: false,
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deepARRef = useRef<DeepARAndroid | null>(null);

  // Check platform on mount
  useEffect(() => {
    const checkPlatform = async () => {
      const info = await Device.getInfo();
      const isNative = info.platform !== 'web';
      setState(prev => ({ ...prev, isNative }));
    };
    checkPlatform();
  }, []);

  // Initialize DeepAR for mobile
  const initializeDeepAR = useCallback(async (): Promise<boolean> => {
    if (!canvasRef.current) {
      setState(prev => ({ ...prev, error: 'Canvas not found' }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (state.isNative) {
        // Native Android/iOS - use native DeepAR SDK
        // This would be bridged from native code
        // For now, placeholder implementation
        console.log('Initializing native DeepAR with Android key:', ANDROID_DEEPAR_KEY.substring(0, 10) + '...');
        
        // Simulate initialization (replace with actual native bridge)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState(prev => ({ 
          ...prev, 
          isInitialized: true, 
          isLoading: false 
        }));
        return true;
      } else {
        // Web platform - use existing web DeepAR
        setState(prev => ({ 
          ...prev, 
          isInitialized: true, 
          isLoading: false 
        }));
        return true;
      }
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to initialize DeepAR' 
      }));
      return false;
    }
  }, [state.isNative]);

  // Switch effect
  const switchEffect = useCallback(async (effectName: string): Promise<void> => {
    if (!state.isInitialized) return;

    try {
      if (state.isNative && deepARRef.current) {
        // Native effect switching
        const effectPath = `effects/${effectName}`;
        await deepARRef.current.switchEffect(effectPath);
      }
    } catch (err) {
      console.error('Failed to switch effect:', err);
    }
  }, [state.isInitialized, state.isNative]);

  // Shutdown DeepAR
  const shutdown = useCallback(() => {
    if (deepARRef.current) {
      deepARRef.current.shutdown();
      deepARRef.current = null;
    }
    setState(prev => ({ 
      ...prev, 
      isInitialized: false 
    }));
  }, []);

  return {
    state,
    canvasRef,
    initializeDeepAR,
    switchEffect,
    shutdown,
  };
}
