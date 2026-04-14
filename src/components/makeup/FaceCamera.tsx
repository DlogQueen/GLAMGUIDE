"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  X, 
  Loader2, 
  ScanFace, 
  Sparkles,
  Lightbulb,
  Wand2,
  Info,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFaceLandmarker, FacialFeatures } from "@/hooks/useFaceLandmarker";

interface FaceCameraProps {
  onAnalysisComplete?: (features: FacialFeatures, suggestions: string[]) => void;
  onTryOnLook?: () => void;
  mode?: 'analysis' | 'tryon' | 'tutorial';
}

export function FaceCamera({ 
  onAnalysisComplete, 
  onTryOnLook,
  mode = 'analysis' 
}: FaceCameraProps) {
  const {
    isLoading,
    error,
    videoRef,
    canvasRef,
    isWebcamRunning,
    faceAnalysis,
    facialFeatures,
    startWebcam,
    stopWebcam,
    getSuggestedLooks
  } = useFaceLandmarker();

  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showingSuggestions, setShowingSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Start camera on mount
  useEffect(() => {
    if (!isLoading && !error) {
      startWebcam();
    }
  }, [isLoading, error, startWebcam]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  // Auto-analyze when face detected
  useEffect(() => {
    if (faceAnalysis && facialFeatures && !analysisComplete) {
      // Simulate progressive analysis
      const timer = setTimeout(() => {
        setAnalysisStep(1);
      }, 1500);
      
      const timer2 = setTimeout(() => {
        setAnalysisStep(2);
        const looks = getSuggestedLooks(facialFeatures);
        setSuggestions(looks);
      }, 3000);
      
      const timer3 = setTimeout(() => {
        setAnalysisComplete(true);
        setShowingSuggestions(true);
        if (onAnalysisComplete) {
          onAnalysisComplete(facialFeatures, suggestions);
        }
      }, 4500);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [faceAnalysis, facialFeatures, analysisComplete, getSuggestedLooks, onAnalysisComplete, suggestions]);

  const getFaceShapeDescription = (shape: string) => {
    const descriptions: Record<string, string> = {
      oval: "Your face is slightly longer than it is wide with a gently rounded jawline - the most versatile face shape!",
      round: "Your face has soft curves with similar width and length - you have a youthful, friendly appearance!",
      square: "Your face has strong, angular features with a defined jawline - very striking and photogenic!",
      heart: "Your face is wider at the forehead and tapers to a narrower chin - romantic and feminine!",
      diamond: "Your face is widest at the cheekbones with a narrow forehead and chin - unique and elegant!",
      oblong: "Your face is longer than it is wide with a long, straight cheek line - sophisticated and model-like!"
    };
    return descriptions[shape] || "Your face has beautiful, balanced proportions!";
  };

  if (isLoading) {
    return (
      <Card className="flex h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-rose-500" />
          <p className="mt-4 text-gray-600">Loading AI face analysis...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex h-[500px] items-center justify-center p-6">
        <div className="text-center">
          <Info className="mx-auto h-10 w-10 text-amber-500" />
          <p className="mt-4 text-gray-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Camera Container */}
      <div className="relative overflow-hidden rounded-xl bg-black">
        <div className="relative aspect-video">
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
          
          {/* Overlay UI */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Face Detection Frame */}
            {!analysisComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="relative h-64 w-48 border-2 border-rose-400/50 rounded-full"
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(244, 63, 94, 0)",
                      "0 0 0 20px rgba(244, 63, 94, 0.1)",
                      "0 0 0 0 rgba(244, 63, 94, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-rose-400 text-sm">
                    Position your face here
                  </div>
                </motion.div>
              </div>
            )}
            
            {/* Analysis Progress */}
            {faceAnalysis && !analysisComplete && (
              <div className="absolute bottom-4 left-4 right-4">
                <Card className="glass p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-rose-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {analysisStep === 0 && "Detecting facial landmarks..."}
                        {analysisStep === 1 && "Analyzing face shape..."}
                        {analysisStep === 2 && "Generating recommendations..."}
                      </p>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                        <motion.div 
                          className="h-full bg-rose-500"
                          initial={{ width: "0%" }}
                          animate={{ 
                            width: analysisStep === 0 ? "33%" : analysisStep === 1 ? "66%" : "100%" 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Results Panel */}
      <AnimatePresence>
        {showingSuggestions && facialFeatures && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 space-y-4"
          >
            {/* Facial Analysis Results */}
            <Card className="overflow-hidden border-2 border-rose-200">
              <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4">
                <div className="flex items-center gap-2 text-white">
                  <ScanFace className="h-5 w-5" />
                  <h3 className="font-semibold">Your Facial Analysis</h3>
                </div>
              </div>
              
              <div className="p-4">
                {/* Face Shape */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                      Face Shape: {facialFeatures.faceShape}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {getFaceShapeDescription(facialFeatures.faceShape)}
                  </p>
                </div>

                {/* Eye Analysis */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-amber-50 p-3">
                    <p className="text-xs text-amber-700">Eye Shape</p>
                    <p className="font-medium text-amber-900 capitalize">{facialFeatures.eyeShape}</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3">
                    <p className="text-xs text-amber-700">Eye Spacing</p>
                    <p className="font-medium text-amber-900 capitalize">{facialFeatures.eyeDistance}</p>
                  </div>
                </div>

                {/* User Input Section */}
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    <Info className="mr-1 inline h-4 w-4" />
                    Tell us more about your preferences or concerns:
                  </label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="E.g., I have oily skin, prefer natural looks, want to minimize my nose appearance..."
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-rose-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                {/* Suggested Looks */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    <Lightbulb className="mr-1 inline h-4 w-4 text-amber-500" />
                    Suggested Techniques for You
                  </h4>
                  
                  <div className="grid gap-2">
                    {suggestions.map((suggestion, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-2 rounded-lg bg-rose-50 p-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 gap-2"
                onClick={() => onTryOnLook?.()}
              >
                <Wand2 className="h-4 w-4" />
                Try On Look with AR
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  setAnalysisComplete(false);
                  setShowingSuggestions(false);
                  setAnalysisStep(0);
                  startWebcam();
                }}
              >
                <RefreshCw className="h-4 w-4" />
                Re-scan
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
