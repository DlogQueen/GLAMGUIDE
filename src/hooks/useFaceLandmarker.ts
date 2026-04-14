"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

export interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

export interface FaceAnalysis {
  landmarks: FaceLandmark[];
  faceBlendshapes: any[];
  facialTransformationMatrixes: any[];
  timestamp: number;
}

export interface FacialFeatures {
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong';
  eyeShape: 'almond' | 'round' | 'hooded' | 'monolid' | 'upturned' | 'downturned';
  eyeDistance: 'close' | 'average' | 'wide';
  eyebrowShape: 'arched' | 'straight' | 'rounded' | 'angular';
  noseWidth: 'narrow' | 'average' | 'wide';
  lipFullness: 'thin' | 'average' | 'full';
  cheekboneHeight: 'low' | 'medium' | 'high';
  skinTone: 'fair' | 'light' | 'medium' | 'tan' | 'deep';
}

export function useFaceLandmarker() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [isWebcamRunning, setIsWebcamRunning] = useState(false);
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysis | null>(null);
  const [facialFeatures, setFacialFeatures] = useState<FacialFeatures | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastVideoTimeRef = useRef<number>(-1);

  // Initialize Face Landmarker
  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      try {
        setIsLoading(true);
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });
        
        setFaceLandmarker(landmarker);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to initialize face detection. Please refresh the page.");
        setIsLoading(false);
        console.error("Face landmarker initialization error:", err);
      }
    };

    initializeFaceLandmarker();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [faceLandmarker]);

  // Analyze facial features from landmarks
  const analyzeFacialFeatures = useCallback((landmarks: FaceLandmark[]): FacialFeatures => {
    if (!landmarks || landmarks.length === 0) {
      return {
        faceShape: 'oval',
        eyeShape: 'almond',
        eyeDistance: 'average',
        eyebrowShape: 'arched',
        noseWidth: 'average',
        lipFullness: 'average',
        cheekboneHeight: 'medium',
        skinTone: 'medium'
      };
    }

    // Key landmark indices for MediaPipe Face Mesh (468 points)
    const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
    const LEFT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
    const RIGHT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
    const NOSE_TIP = 1;
    const NOSE_BRIDGE = 6;
    const LEFT_CHEEK = 123;
    const RIGHT_CHEEK = 352;
    const CHIN = 152;
    const FOREHEAD = 10;
    
    // Calculate face shape metrics
    const faceWidth = Math.abs(landmarks[RIGHT_CHEEK].x - landmarks[LEFT_CHEEK].x);
    const faceHeight = Math.abs(landmarks[CHIN].y - landmarks[FOREHEAD].y);
    const faceRatio = faceWidth / faceHeight;
    
    // Jaw angle analysis
    const jawWidth = Math.abs(landmarks[454].x - landmarks[234].x);
    const jawRatio = jawWidth / faceWidth;
    
    let faceShape: FacialFeatures['faceShape'] = 'oval';
    if (faceRatio > 0.85) faceShape = 'round';
    else if (jawRatio > 0.75 && faceRatio < 0.75) faceShape = 'square';
    else if (faceRatio < 0.7) faceShape = 'oblong';
    else if (landmarks[CHIN].y > landmarks[LEFT_CHEEK].y + 0.1) faceShape = 'heart';
    else if (landmarks[LEFT_CHEEK].y < landmarks[NOSE_TIP].y - 0.05) faceShape = 'diamond';
    
    // Eye shape analysis
    const leftEyeHeight = Math.abs(landmarks[159].y - landmarks[145].y);
    const leftEyeWidth = Math.abs(landmarks[362].x - landmarks[263].x);
    const eyeRatio = leftEyeHeight / leftEyeWidth;
    
    let eyeShape: FacialFeatures['eyeShape'] = 'almond';
    if (eyeRatio > 0.5) eyeShape = 'round';
    else if (landmarks[159].y > landmarks[145].y + 0.02) eyeShape = 'hooded';
    
    // Eye distance analysis
    const eyeDistance = Math.abs(landmarks[263].x - landmarks[33].x);
    let eyeDistanceCat: FacialFeatures['eyeDistance'] = 'average';
    if (eyeDistance < faceWidth * 0.25) eyeDistanceCat = 'close';
    else if (eyeDistance > faceWidth * 0.35) eyeDistanceCat = 'wide';
    
    // Return analyzed features
    return {
      faceShape,
      eyeShape,
      eyeDistance: eyeDistanceCat,
      eyebrowShape: 'arched', // Would need more detailed analysis
      noseWidth: faceWidth > 0.5 ? 'wide' : faceWidth < 0.3 ? 'narrow' : 'average',
      lipFullness: 'average', // Would need lip landmarks
      cheekboneHeight: landmarks[LEFT_CHEEK].y < landmarks[NOSE_TIP].y ? 'high' : 'medium',
      skinTone: 'medium' // Would need color analysis
    };
  }, []);

  // Start webcam
  const startWebcam = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });
      
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsWebcamRunning(true);
    } catch (err) {
      setError("Unable to access camera. Please allow camera permissions.");
      console.error("Camera access error:", err);
    }
  }, []);

  // Stop webcam
  const stopWebcam = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Predict and draw
  const predictWebcam = useCallback(() => {
    if (!faceLandmarker || !videoRef.current || !canvasRef.current || !isWebcamRunning) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx || video.videoWidth === 0) {
      animationRef.current = requestAnimationFrame(predictWebcam);
      return;
    }
    
    // Match canvas size to video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const startTimeMs = performance.now();
    
    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      
      const results = faceLandmarker.detectForVideo(video, startTimeMs);
      
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        
        setFaceAnalysis({
          landmarks,
          faceBlendshapes: results.faceBlendshapes || [],
          facialTransformationMatrixes: results.facialTransformationMatrixes || [],
          timestamp: startTimeMs
        });
        
        // Analyze facial features
        const features = analyzeFacialFeatures(landmarks);
        setFacialFeatures(features);
        
        // Draw landmarks on canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Draw face mesh
        ctx.strokeStyle = "rgba(244, 63, 94, 0.5)";
        ctx.lineWidth = 1;
        ctx.fillStyle = "rgba(244, 63, 94, 0.3)";
        
        // Draw key landmarks
        landmarks.forEach((landmark, index) => {
          const x = landmark.x * canvas.width;
          const y = landmark.y * canvas.height;
          
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, 2 * Math.PI);
          ctx.fill();
        });
        
        // Draw face outline
        const faceOutline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
        ctx.beginPath();
        faceOutline.forEach((idx, i) => {
          const x = landmarks[idx].x * canvas.width;
          const y = landmarks[idx].y * canvas.height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
        
        // Draw eyes
        const leftEye = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
        const rightEye = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
        
        ctx.strokeStyle = "rgba(250, 204, 21, 0.7)";
        
        [leftEye, rightEye].forEach(eye => {
          ctx.beginPath();
          eye.forEach((idx, i) => {
            const x = landmarks[idx].x * canvas.width;
            const y = landmarks[idx].y * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
          ctx.stroke();
        });
        
        // Draw lips
        const lips = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61];
        ctx.strokeStyle = "rgba(236, 72, 153, 0.7)";
        ctx.beginPath();
        lips.forEach((idx, i) => {
          const x = landmarks[idx].x * canvas.width;
          const y = landmarks[idx].y * canvas.height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
    }
    
    animationRef.current = requestAnimationFrame(predictWebcam);
  }, [faceLandmarker, isWebcamRunning, analyzeFacialFeatures]);

  // Start prediction loop when webcam is running
  useEffect(() => {
    if (isWebcamRunning && faceLandmarker) {
      predictWebcam();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isWebcamRunning, faceLandmarker, predictWebcam]);

  // Get suggested looks based on facial features
  const getSuggestedLooks = useCallback((features: FacialFeatures): string[] => {
    const suggestions: string[] = [];
    
    // Face shape recommendations
    switch (features.faceShape) {
      case 'round':
        suggestions.push('Contouring techniques to add definition');
        suggestions.push('Winged eyeliner to elongate');
        break;
      case 'square':
        suggestions.push('Soft, blended eyeshadow to soften angles');
        suggestions.push('Round blush application');
        break;
      case 'heart':
        suggestions.push('Bottom lash emphasis for balance');
        suggestions.push('Soft contour on forehead');
        break;
      case 'diamond':
        suggestions.push('Highlight cheekbones for glow');
        suggestions.push('Playful blush placement');
        break;
      case 'oblong':
        suggestions.push('Horizontal blush for width');
        suggestions.push('Bold lip colors');
        break;
      default:
        suggestions.push('Versatile looks suit your oval face');
    }
    
    // Eye shape recommendations
    switch (features.eyeShape) {
      case 'hooded':
        suggestions.push('Cut crease techniques for definition');
        break;
      case 'round':
        suggestions.push('Smokey eye for elongation');
        break;
      case 'almond':
        suggestions.push('Classic cat-eye liner');
        break;
    }
    
    // Eye distance
    if (features.eyeDistance === 'close') {
      suggestions.push('Inner corner highlight to open eyes');
    } else if (features.eyeDistance === 'wide') {
      suggestions.push('Dark shadow on inner corners');
    }
    
    return suggestions;
  }, []);

  return {
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
  };
}
