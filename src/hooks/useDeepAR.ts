"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DeepARManager, loadDeepARModule, getEffectForStep, getFullLookEffect } from "@/services/deepArService";
import { MakeupStep } from "@/types";

interface UseDeepAROptions {
  licenseKey: string | null;
  autoLoad?: boolean;
}

interface UseDeepARReturn {
  // Refs
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  
  // State
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  currentEffect: string | null;
  deepARMode: boolean;
  
  // Actions
  initialize: () => Promise<boolean>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  applyStepEffect: (step: MakeupStep) => Promise<void>;
  applyFullLook: (lookName: string) => Promise<void>;
  clearEffects: () => Promise<void>;
  toggleDeepARMode: () => void;
  shutdown: () => void;
}

export function useDeepAR(options: UseDeepAROptions): UseDeepARReturn {
  const { licenseKey, autoLoad = false } = options;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const managerRef = useRef<DeepARManager | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentEffect, setCurrentEffect] = useState<string | null>(null);
  const [deepARMode, setDeepARMode] = useState(true);
  const [moduleLoaded, setModuleLoaded] = useState(false);

  // Load DeepAR module
  useEffect(() => {
    if (!licenseKey) return;
    
    const loadModule = async () => {
      const loaded = await loadDeepARModule();
      setModuleLoaded(!!loaded);
      if (!loaded) {
        setError("Failed to load DeepAR SDK. Will use MediaPipe fallback.");
        setDeepARMode(false);
      }
    };
    
    loadModule();
  }, [licenseKey]);

  // Initialize DeepAR manager
  const initialize = useCallback(async (): Promise<boolean> => {
    if (!licenseKey || !canvasRef.current || !moduleLoaded) {
      setDeepARMode(false);
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const manager = new DeepARManager(licenseKey);
      
      const success = await manager.initialize(canvasRef.current);
      
      if (success) {
        managerRef.current = manager;
        setIsReady(true);
        setIsLoading(false);
        return true;
      } else {
        setError("DeepAR initialization failed. Using MediaPipe fallback.");
        setDeepARMode(false);
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError("DeepAR error: " + (err as Error).message);
      setDeepARMode(false);
      setIsLoading(false);
      return false;
    }
  }, [licenseKey, moduleLoaded]);

  // Auto-initialize if requested
  useEffect(() => {
    if (autoLoad && licenseKey && moduleLoaded && !isReady) {
      initialize();
    }
  }, [autoLoad, licenseKey, moduleLoaded, isReady, initialize]);

  // Start camera
  const startCamera = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      
      // Start DeepAR if available
      if (managerRef.current && deepARMode) {
        await managerRef.current.startCamera(videoRef.current);
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
    }
  }, [deepARMode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (managerRef.current) {
      managerRef.current.pause();
    }
  }, []);

  // Apply step effect
  const applyStepEffect = useCallback(async (step: MakeupStep) => {
    if (!managerRef.current || !deepARMode) return;
    
    const effect = getEffectForStep(step);
    if (effect) {
      await managerRef.current.switchEffect(effect);
      setCurrentEffect(effect);
    }
  }, [deepARMode]);

  // Apply full look
  const applyFullLook = useCallback(async (lookName: string) => {
    if (!managerRef.current || !deepARMode) return;
    
    const effect = getFullLookEffect(lookName);
    if (effect) {
      await managerRef.current.switchEffect(effect);
      setCurrentEffect(effect);
    }
  }, [deepARMode]);

  // Clear effects
  const clearEffects = useCallback(async () => {
    if (!managerRef.current || !deepARMode) return;
    
    await managerRef.current.clearEffect();
    setCurrentEffect(null);
  }, [deepARMode]);

  // Toggle DeepAR on/off
  const toggleDeepARMode = useCallback(() => {
    setDeepARMode(prev => {
      const newMode = !prev;
      if (!newMode && managerRef.current) {
        // Turning off - clear effects
        managerRef.current.clearEffect();
        setCurrentEffect(null);
      }
      return newMode;
    });
  }, []);

  // Shutdown
  const shutdown = useCallback(() => {
    stopCamera();
    
    if (managerRef.current) {
      managerRef.current.shutdown();
      managerRef.current = null;
    }
    
    setIsReady(false);
    setCurrentEffect(null);
  }, [stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shutdown();
    };
  }, [shutdown]);

  return {
    canvasRef,
    videoRef,
    isReady,
    isLoading,
    error,
    currentEffect,
    deepARMode,
    initialize,
    startCamera,
    stopCamera,
    applyStepEffect,
    applyFullLook,
    clearEffects,
    toggleDeepARMode,
    shutdown
  };
}
