"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Sparkles,
  Clock,
  Target,
  AlertCircle
} from "lucide-react";
import { MakeupStep } from "@/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StepOverlayProps {
  step: MakeupStep;
  stepNumber: number;
  totalSteps: number;
  progress: number;
  timeRemaining: number;
  isActive: boolean;
  onComplete: () => void;
  faceDetected: boolean;
}

export function StepOverlay({
  step,
  stepNumber,
  totalSteps,
  progress,
  timeRemaining,
  isActive,
  onComplete,
  faceDetected
}: StepOverlayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="pointer-events-auto absolute bottom-4 left-4 right-4"
        >
          {/* Main Step Card */}
          <Card className="border-rose-200 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
            {/* Header with progress */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-sm font-bold text-white">
                  {stepNumber}
                </div>
                <span className="text-sm text-gray-500">
                  of {totalSteps} steps
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span className={timeRemaining < 30 ? "text-red-500 font-medium" : ""}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step content */}
            <div className="mb-3">
              <h3 className="mb-1 font-serif text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600">
                {step.description}
              </p>
            </div>

            {/* Target areas */}
            {step.targetAreas && step.targetAreas.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                <Target className="mr-1 h-4 w-4 text-rose-500" />
                {step.targetAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-700"
                  >
                    {area.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Tools & Products */}
            <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
              {step.tools && step.tools.length > 0 && (
                <div className="rounded-lg bg-gray-50 p-2">
                  <span className="font-medium text-gray-700">Tools:</span>
                  <p className="text-gray-600">{step.tools.slice(0, 2).join(', ')}</p>
                </div>
              )}
              {step.products && step.products.length > 0 && (
                <div className="rounded-lg bg-gray-50 p-2">
                  <span className="font-medium text-gray-700">Products:</span>
                  <p className="text-gray-600">{step.products.slice(0, 2).join(', ')}</p>
                </div>
              )}
            </div>

            {/* Face detection warning */}
            {!faceDetected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 p-2 text-sm text-amber-700"
              >
                <AlertCircle className="h-4 w-4" />
                <span>Position your face in the camera</span>
              </motion.div>
            )}

            {/* Complete button */}
            <button
              onClick={onComplete}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 py-2.5 text-sm font-medium text-white transition-all hover:from-rose-600 hover:to-rose-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Complete Step
            </button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Step progress indicator dots
interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

export function StepProgressDots({ currentStep, totalSteps, completedSteps }: StepProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => {
        const isCompleted = completedSteps.includes(stepNum);
        const isCurrent = stepNum === currentStep;
        
        return (
          <motion.div
            key={stepNum}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
              isCompleted
                ? "bg-green-500 text-white"
                : isCurrent
                ? "bg-rose-500 text-white ring-4 ring-rose-200"
                : "bg-gray-200 text-gray-500"
            }`}
            animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: isCurrent ? Infinity : 0, duration: 2 }}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              stepNum
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
