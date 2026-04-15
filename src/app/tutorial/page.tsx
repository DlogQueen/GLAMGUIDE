"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Video,
  ExternalLink,
  Sparkles,
  Info,
  Timer,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeepARCamera } from "@/components/makeup/DeepARCamera";
import { presetMakeupStyles, getStyleById } from "@/data/makeupStyles";
import { MakeupStyle, MakeupStep, FacialFeatures } from "@/types";
import { 
  searchTutorials, 
  getTutorialsForStep, 
  getProTips,
  YouTubeTutorial,
  ProTip 
} from "@/services/tutorialService";
import { generateCoachingTip } from "@/services/aiService";
import { speakWithPremiumVoice, VOICE_OPTIONS } from "@/services/voiceService";
import { StepOverlay, StepProgressDots } from "@/components/makeup/StepOverlay";
import { useAuth } from "@/contexts/AuthContext";
import { betaLocal } from "@/services/betaLocal";

function TutorialContent() {
  const searchParams = useSearchParams();
  const styleId = searchParams.get("style");
  const { completeTutorial } = useAuth();
  
  const [style, setStyle] = useState<MakeupStyle | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isARActive, setIsARActive] = useState(false);
  const [facialFeatures, setFacialFeatures] = useState<FacialFeatures | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [coachingMessage, setCoachingMessage] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [stepTutorials, setStepTutorials] = useState<YouTubeTutorial[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepProgress, setStepProgress] = useState(0);
  const [stepTimer, setStepTimer] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [proTips, setProTips] = useState<ProTip[]>([]);
  const [showTutorials, setShowTutorials] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Load style
  useEffect(() => {
    if (styleId) {
      const foundStyle = getStyleById(styleId);
      if (foundStyle) {
        setStyle(foundStyle);
      }
    }
    // Default to first style if none selected
    if (!style && presetMakeupStyles.length > 0) {
      setStyle(presetMakeupStyles[0]);
    }
  }, [styleId, style]);

  // Get current step
  const step: MakeupStep | undefined = style?.steps[currentStep];

  // Load tutorials and tips for current step
  useEffect(() => {
    if (step) {
      const tutorials = getTutorialsForStep(step, facialFeatures || undefined);
      setStepTutorials(tutorials);
      
      const tips = getProTips(step.title);
      setProTips(tips);
    }
  }, [step, facialFeatures]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && step) {
      interval = setInterval(() => {
        setTimer(t => {
          if (t >= step.duration) {
            setIsTimerRunning(false);
            return step.duration;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, step]);

  // Reset timer on step change
  useEffect(() => {
    setTimer(0);
    setStepTimer(0);
    setStepProgress(0);
    setIsTimerRunning(false);
  }, [currentStep]);

  // Phase 3: Step timer and progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && step) {
      interval = setInterval(() => {
        setStepTimer(t => {
          const newTime = t + 1;
          // Calculate progress percentage
          const progress = Math.min(100, (newTime / step.duration) * 100);
          setStepProgress(progress);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, step]);

  // Voice coaching - ElevenLabs premium AI voice
  const speakInstruction = useCallback(async () => {
    if (!step || isSpeaking) return;
    
    setIsSpeaking(true);
    
    // Use ElevenLabs premium voice (falls back to browser TTS if API key not set)
    const coachingText = `${step.instruction}. ${step.tips[0] || ''}`;
    await speakWithPremiumVoice(coachingText, () => setIsSpeaking(false));
    
    // Get AI coaching tip
    try {
      const tip = await generateCoachingTip(step, (timer / (step?.duration || 1)) * 100);
      setCoachingMessage(tip);
    } catch {
      setCoachingMessage(step.tips[0] || "Take your time and enjoy the process!");
    }
  }, [step, isSpeaking, timer]);

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Navigation
  const goToNextStep = () => {
    if (style && currentStep < style.steps.length - 1) {
      setCurrentStep(c => c + 1);
      setCoachingMessage("");
    }
  };

  // Phase 3: Complete current step
  const completeCurrentStep = () => {
    if (!step || !style) return;
    
    // Mark step as completed
    setCompletedSteps(prev => [...prev, currentStep + 1]);
    
    // Move to next step or finish
    if (currentStep < style.steps.length - 1) {
      setCurrentStep(c => c + 1);
      setCoachingMessage("Great job! Moving to next step... 💄");
    } else {
      setCoachingMessage("🎉 Tutorial complete! You look fabulous!");
      betaLocal.addTutorialHistory({
        styleId: style.id,
        styleName: style.name,
        completedAt: new Date().toISOString(),
      });
      completeTutorial(style.id);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
      setCoachingMessage("");
    }
  };

  // Face analysis complete
  const handleFaceAnalysis = (features: FacialFeatures, suggestions: string[]) => {
    setFacialFeatures(features);
    // Show personalized message
    setCoachingMessage(`I can see you have a beautiful ${features.faceShape} face shape! I've personalized this tutorial for your features.`);
  };

  if (!style) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img 
                src="/images/logo.png" 
                alt="Glam Guide AI" 
                className="h-8 w-auto hover:scale-105 transition-transform"
              />
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-serif text-lg font-semibold text-gray-900">{style.name}</h1>
              <p className="text-xs text-gray-500">Step {currentStep + 1} of {style.steps.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Timer className="h-3 w-3" />
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')} / {step?.duration ? Math.floor(step.duration / 60) : 0}:{step?.duration ? (step.duration % 60).toString().padStart(2, '0') : '00'}
            </Badge>
            <Button 
              variant={isTimerRunning ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-100">
          <motion.div 
            className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / style.steps.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Camera / AR View */}
          <div className="relative space-y-4">
            {/* Camera with Step Overlay */}
            <div className="relative">
              <DeepARCamera 
                currentStep={step}
                lookName={style.name}
                onAnalysisComplete={handleFaceAnalysis}
                onFaceDetected={setFaceDetected}
                mode="tutorial"
              />
              
              {/* Phase 3: Step Overlay */}
              {step && (
                <StepOverlay
                  step={step}
                  stepNumber={currentStep + 1}
                  totalSteps={style.steps.length}
                  progress={stepProgress}
                  timeRemaining={Math.max(0, step.duration - stepTimer)}
                  isActive={true}
                  onComplete={completeCurrentStep}
                  faceDetected={faceDetected}
                />
              )}
            </div>
            
            {/* Step Progress Dots */}
            <StepProgressDots
              currentStep={currentStep + 1}
              totalSteps={style.steps.length}
              completedSteps={completedSteps}
            />

            {/* Coaching Message */}
            <AnimatePresence>
              {coachingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-white">
                    <CardContent className="flex items-start gap-3 p-4">
                      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                      <p className="text-sm text-gray-700">{coachingMessage}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Navigation */}
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={goToPrevStep}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex gap-1">
                {style.steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      idx === currentStep 
                        ? "bg-rose-500" 
                        : idx < currentStep 
                          ? "bg-rose-300" 
                          : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                onClick={goToNextStep}
                disabled={currentStep === style.steps.length - 1}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right: Instructions & Resources */}
          <div className="space-y-4">
            {step && (
              <>
                {/* Step Card */}
                <Card className="border-2 border-rose-100">
                  <CardHeader className="border-b border-rose-100 bg-gradient-to-r from-rose-50 to-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className="mb-2 bg-rose-100 text-rose-800">
                          Step {step.order}
                        </Badge>
                        <h2 className="font-serif text-2xl font-bold text-gray-900">
                          {step.title}
                        </h2>
                      </div>
                      <Button
                        variant={isSpeaking ? "default" : "outline"}
                        size="icon"
                        onClick={isSpeaking ? stopSpeaking : speakInstruction}
                      >
                        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <p className="text-lg text-gray-700">{step.description}</p>
                    <div className="rounded-lg bg-amber-50 p-4">
                      <p className="text-amber-900">{step.instruction}</p>
                    </div>

                    {/* Tools & Products */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-900">Tools Needed:</h4>
                        <div className="flex flex-wrap gap-1">
                          {step.tools.map(tool => (
                            <Badge key={tool} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mb-3">
                        <h4 className="mb-2 text-sm font-medium text-gray-900">Products:</h4>
                        <div className="flex flex-wrap gap-1">
                          {step.products.map((product, idx) => {
                            const isObject = typeof product === 'object' && product !== null;
                            const productName = isObject ? (product as {name: string}).name : product as string;
                            const productLink = isObject ? (product as {link?: string}).link : undefined;
                            const productPrice = isObject ? (product as {price?: string}).price : undefined;
                            
                            return (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {productLink ? (
                                  <a href={productLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {productName} {productPrice && `(${productPrice})`}
                                  </a>
                                ) : (
                                  productName
                                )}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Pro Tips:</h4>
                      {step.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Toggle Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant={showTutorials ? "default" : "outline"}
                    onClick={() => setShowTutorials(!showTutorials)}
                    className="flex-1 gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Video Tutorials
                  </Button>
                  <Button 
                    variant={showTips ? "default" : "outline"}
                    onClick={() => setShowTips(!showTips)}
                    className="flex-1 gap-2"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Pro Tips
                  </Button>
                </div>

                {/* YouTube Tutorials */}
                <AnimatePresence>
                  {showTutorials && stepTutorials.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card>
                        <CardHeader className="border-b">
                          <h3 className="font-semibold text-gray-900">Related Video Tutorials</h3>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {stepTutorials.map(tutorial => (
                              <a
                                key={tutorial.id}
                                href={tutorial.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-rose-50"
                              >
                                <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded bg-gray-200">
                                  <Video className="h-6 w-6 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="truncate text-sm font-medium text-gray-900">
                                    {tutorial.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {tutorial.channel} • {tutorial.views} views
                                  </p>
                                </div>
                                <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
                              </a>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pro Tips */}
                <AnimatePresence>
                  {showTips && proTips.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card>
                        <CardHeader className="border-b">
                          <h3 className="font-semibold text-gray-900">Expert Techniques</h3>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {proTips.map(tip => (
                              <div key={tip.id} className="rounded-lg bg-amber-50 p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <Palette className="h-4 w-4 text-amber-600" />
                                  <h4 className="font-medium text-amber-900">{tip.title}</h4>
                                </div>
                                <p className="text-sm text-amber-800">{tip.content}</p>
                                <p className="mt-1 text-xs text-amber-600">Source: {tip.source}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TutorialPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    }>
      <TutorialContent />
    </Suspense>
  );
}
