"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ScanFace, 
  Settings,
  AlertCircle,
  Zap,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDeepAR } from "@/hooks/useDeepAR";
import { FaceCamera } from "./FaceCamera";
import { MakeupStep } from "@/types";
import { DEFAULT_DEEPAR_KEY } from "@/services/deepArService";

interface DeepARCameraProps {
  currentStep?: MakeupStep;
  lookName?: string;
  onAnalysisComplete?: (features: any, suggestions: any[]) => void;
  onFaceDetected?: (detected: boolean) => void;
  mode?: 'analysis' | 'tryon' | 'tutorial';
}

export function DeepARCamera({ 
  currentStep, 
  lookName,
  onAnalysisComplete,
  onFaceDetected,
  mode = 'tutorial' 
}: DeepARCameraProps) {
  const [deepARKey, setDeepARKey] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [useMediaPipeFallback, setUseMediaPipeFallback] = useState(false);
  const [deepARActive, setDeepARActive] = useState(true);
  
  const deepARHook = useDeepAR({
    licenseKey: deepARKey || DEFAULT_DEEPAR_KEY || null,
    autoLoad: false
  });
  
  const {
    canvasRef,
    videoRef,
    isReady,
    isLoading,
    error,
    currentEffect,
    deepARMode,
    initialize,
    startCamera,
    applyStepEffect,
    applyFullLook,
    toggleDeepARMode,
    shutdown
  } = deepARHook;

  // Try to load key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('deepar_license_key');
    if (savedKey) {
      setDeepARKey(savedKey);
    }
  }, []);

  // Save key when changed
  const saveKey = () => {
    localStorage.setItem('deepar_license_key', deepARKey);
    setShowSettings(false);
    // Re-initialize with new key
    if (deepARKey) {
      initialize().then((success: boolean) => {
        if (success) {
          startCamera();
        }
      });
    }
  };

  // Apply effects when step changes
  useEffect(() => {
    if (currentStep && isReady && deepARMode) {
      applyStepEffect(currentStep);
    }
  }, [currentStep, isReady, deepARMode, applyStepEffect]);

  // Apply full look when look name changes
  useEffect(() => {
    if (lookName && isReady && deepARMode) {
      applyFullLook(lookName);
    }
  }, [lookName, isReady, deepARMode, applyFullLook]);

  // Show MediaPipe fallback if DeepAR fails or no key
  if (useMediaPipeFallback || !deepARKey || error || !deepARMode) {
    return (
      <div className="space-y-4">
        {/* DeepAR Promo Banner */}
        {!deepARKey && (
          <Card className="border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="font-medium text-amber-900">Unlock Premium AR with DeepAR</p>
                <p className="text-sm text-amber-700">
                  Add your DeepAR license key for photorealistic makeup try-on effects.
                  Currently using free MediaPipe fallback.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 gap-2"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-4 w-4" />
                  Add License Key
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {/* MediaPipe Fallback */}
        <FaceCamera 
          onAnalysisComplete={onAnalysisComplete}
          mode={mode}
        />
        
        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
              >
                <h3 className="font-serif text-xl font-semibold text-gray-900">
                  DeepAR Configuration
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your DeepAR license key to enable premium AR effects.
                </p>
                <div className="mt-4 space-y-3">
                  <Input
                    type="password"
                    placeholder="Enter DeepAR license key..."
                    value={deepARKey}
                    onChange={(e) => setDeepARKey(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={saveKey} className="flex-1">
                      Save & Initialize
                    </Button>
                    <Button variant="outline" onClick={() => setShowSettings(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  Your key is stored locally in your browser. Get a key at{" "}
                  <a 
                    href="https://www.deepar.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-rose-600 hover:underline"
                  >
                    deepar.ai
                  </a>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // DeepAR Active View
  return (
    <div className="space-y-4">
      {/* DeepAR Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-rose-500" />
          <span className="font-medium text-gray-900">DeepAR Premium</span>
          {isReady && (
            <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-700">
              <ScanFace className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant={deepARMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              toggleDeepARMode();
              if (!deepARMode) {
                setUseMediaPipeFallback(true);
              }
            }}
          >
            {deepARMode ? "AR On" : "AR Off"}
          </Button>
        </div>
      </div>

      {/* DeepAR Canvas */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
          />
          
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
                <p className="mt-2 text-sm">Loading DeepAR...</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4">
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => { toggleDeepARMode(); setUseMediaPipeFallback(true); }}
                >
                  Use Free Alternative
                </Button>
              </div>
            </div>
          )}
          
          {/* Effect Badge */}
          {currentEffect && (
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                <Layers className="h-4 w-4 text-white" />
                <span className="text-xs text-white">
                  {currentEffect.split('/').pop()?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* DeepAR Effects Info */}
      {currentEffect && (
        <Card className="p-4">
          <h4 className="mb-2 text-sm font-medium text-gray-900">Active Effect:</h4>
          <Badge variant="secondary" className="text-xs">
            {currentEffect.split('/').pop()?.replace(/_/g, ' ')}
          </Badge>
        </Card>
      )}

      {/* Initialize Button */}
      {!isReady && !isLoading && (
        <Button onClick={() => { initialize(); startCamera(); }} className="w-full gap-2">
          <Sparkles className="h-4 w-4" />
          Start DeepAR Camera
        </Button>
      )}
    </div>
  );
}
