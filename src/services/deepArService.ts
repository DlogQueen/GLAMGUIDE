// DeepAR Service - Official SDK Integration
// Uses deepar NPM package: npm install deepar
// Documentation: https://docs.deepar.ai/getting-started

import { MakeupStep } from "@/types";

// DeepAR SDK instance type
type DeepARSDK = typeof import('deepar');
let deeparModule: DeepARSDK | null = null;

// Pre-configured DeepAR license keys
// Web SDK key
export const DEFAULT_DEEPAR_KEY = '89b915eb4db2d9449cc4d4e98816296a7d928a793cd02843befbc7d76950f320e527bf637fab5a73';
// Android/iOS SDK key (for React Native / Capacitor builds)
export const ANDROID_DEEPAR_KEY = 'a07a4dfc5c43c8690be3784ead5c845be2439762b65ea1edecd787346b248d30d684e9dbc09b661c';

// CDN effects from DeepAR (free effects)
export const DEEPAR_CDN = 'https://cdn.jsdelivr.net/npm/deepar/effects';

// DeepAR effect presets for makeup
export const DEEPAR_EFFECTS = {
  // Free effects from DeepAR CDN
  AVIATORS: `${DEEPAR_CDN}/aviators`,
  BEAUTY: `${DEEPAR_CDN}/beauty`,
  BLOSSOM: `${DEEPAR_CDN}/blossom`,
  EMOJI: `${DEEPAR_CDN}/emoji`,
  FIRE: `${DEEPAR_CDN}/fire`,
  FLOWERS: `${DEEPAR_CDN}/flowers`,
  GALAXY: `${DEEPAR_CDN}/galaxy`,
  HEART: `${DEEPAR_CDN}/heart`,
  MASK: `${DEEPAR_CDN}/mask`,
  RAINBOW: `${DEEPAR_CDN}/rainbow`,
  SNAIL: `${DEEPAR_CDN}/snail`,
  SPLIT_VIEW: `${DEEPAR_CDN}/split_view`,
  VIRTUAL_Glasses: `${DEEPAR_CDN}/virtual_glasses`,
  
  // Makeup-specific effects (placeholders - you'll need actual .deepar files)
  SMOOTH_SKIN: "effects/Beauty.smooth_skin",
  TEETH_WHITENING: "effects/Beauty.teeth_whitening",
  EYELINER_NATURAL: "effects/Makeup.eyeliner_natural",
  EYELINER_WINGED: "effects/Makeup.eyeliner_winged",
  EYESHADOW_NEUTRAL: "effects/Makeup.eyeshadow_neutral",
  EYESHADOW_SMOKEY: "effects/Makeup.eyeshadow_smokey",
  BLUSH_PINK: "effects/Makeup.blush_pink",
  LIP_GLOSS_NUDE: "effects/Makeup.lip_gloss_nude",
  NATURAL_GLOW: "effects/Looks.natural_glow",
  SMOKEY_EYE: "effects/Looks.smokey_eye",
};

// DeepAR Manager class using official SDK
export class DeepARManager {
  private deepAR: any = null;
  private canvas: HTMLCanvasElement | null = null;
  private licenseKey: string;
  private isInitialized = false;
  private currentEffect: string | null = null;

  constructor(licenseKey: string) {
    this.licenseKey = licenseKey;
  }

  // Initialize DeepAR SDK
  async initialize(canvas: HTMLCanvasElement): Promise<boolean> {
    try {
      // Dynamically import deepar to avoid SSR issues
      if (!deeparModule) {
        deeparModule = await import('deepar');
      }

      this.canvas = canvas;
      
      // Initialize DeepAR with official API
      this.deepAR = await deeparModule.initialize({
        licenseKey: this.licenseKey,
        canvas: canvas,
        additionalOptions: {
          cameraConfig: {
            disableDefaultCamera: true // We'll handle camera separately
          }
        }
      });

      this.isInitialized = true;
      console.log('DeepAR initialized successfully');
      return true;
    } catch (error) {
      console.error('DeepAR initialization failed:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // Start camera with DeepAR
  async startCamera(videoElement: HTMLVideoElement): Promise<void> {
    if (!this.isInitialized || !this.deepAR) {
      console.warn('DeepAR not initialized');
      return;
    }

    try {
      // Set video element for DeepAR processing
      this.deepAR.setVideoElement(videoElement, true);
      await this.deepAR.startCamera();
    } catch (error) {
      console.error('Failed to start DeepAR camera:', error);
    }
  }

  // Switch AR effect
  async switchEffect(effectPath: string): Promise<void> {
    if (!this.isInitialized || !this.deepAR) {
      console.warn('DeepAR not initialized, cannot switch effect');
      return;
    }

    try {
      await this.deepAR.switchEffect(effectPath);
      this.currentEffect = effectPath;
      console.log('Switched to effect:', effectPath);
    } catch (error) {
      console.error('Failed to switch DeepAR effect:', error);
    }
  }

  // Clear current effect
  async clearEffect(): Promise<void> {
    if (!this.isInitialized || !this.deepAR) return;

    try {
      // Switch to null/empty effect to clear
      await this.deepAR.switchEffect(null);
      this.currentEffect = null;
    } catch (error) {
      console.error('Failed to clear DeepAR effect:', error);
    }
  }

  // Take screenshot
  async takeScreenshot(): Promise<string | null> {
    if (!this.isInitialized || !this.deepAR) {
      console.warn('DeepAR not initialized');
      return null;
    }

    try {
      const image = await this.deepAR.takeScreenshot();
      return image; // Returns data URL
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      return null;
    }
  }

  // Start video recording
  async startVideoRecording(): Promise<void> {
    if (!this.isInitialized || !this.deepAR) {
      console.warn('DeepAR not initialized');
      return;
    }

    try {
      await this.deepAR.startVideoRecording();
    } catch (error) {
      console.error('Failed to start video recording:', error);
    }
  }

  // Finish video recording
  async finishVideoRecording(): Promise<Blob | null> {
    if (!this.isInitialized || !this.deepAR) {
      console.warn('DeepAR not initialized');
      return null;
    }

    try {
      const video = await this.deepAR.finishVideoRecording();
      return video;
    } catch (error) {
      console.error('Failed to finish video recording:', error);
      return null;
    }
  }

  // Background blur
  async backgroundBlur(enabled: boolean, strength: number = 5): Promise<void> {
    if (!this.isInitialized || !this.deepAR) {
      console.warn('DeepAR not initialized');
      return;
    }

    try {
      await this.deepAR.backgroundBlur(enabled, strength);
    } catch (error) {
      console.error('Failed to set background blur:', error);
    }
  }

  // Set face visibility callback
  onFaceVisibilityChanged(callback: (visible: boolean) => void): void {
    if (!this.deepAR) {
      console.warn('DeepAR not initialized');
      return;
    }

    this.deepAR.callbacks.onFaceVisibilityChanged = callback;
  }

  // Pause DeepAR
  pause(): void {
    if (this.deepAR) {
      this.deepAR.pause();
    }
  }

  // Resume DeepAR
  resume(): void {
    if (this.deepAR) {
      this.deepAR.resume();
    }
  }

  // Shutdown DeepAR
  shutdown(): void {
    if (this.deepAR) {
      this.deepAR.shutdown();
      this.isInitialized = false;
      this.currentEffect = null;
      this.deepAR = null;
    }
  }

  // Check if ready
  isReady(): boolean {
    return this.isInitialized && !!this.deepAR;
  }

  // Get current effect
  getCurrentEffect(): string | null {
    return this.currentEffect;
  }
}

// Map makeup steps to DeepAR effects (using available free effects)
export function getEffectForStep(step: MakeupStep): string | null {
  const title = step.title.toLowerCase();
  const description = step.description.toLowerCase();
  
  // Use free effects as stand-ins for makeup
  if (title.includes('eye') || title.includes('shadow') || title.includes('liner')) {
    return DEEPAR_EFFECTS.AVIATORS; // Use aviators as eye effect placeholder
  }
  
  if (title.includes('lip')) {
    return DEEPAR_EFFECTS.HEART; // Use heart as lip effect placeholder
  }
  
  if (title.includes('blush') || title.includes('glow')) {
    return DEEPAR_EFFECTS.BLOSSOM; // Use blossom as glow effect
  }
  
  if (title.includes('smooth') || title.includes('skin') || title.includes('foundation')) {
    return DEEPAR_EFFECTS.BEAUTY; // Use beauty filter for skin
  }
  
  return null;
}

// Get effect for full look
export function getFullLookEffect(lookName: string): string | null {
  const normalized = lookName.toLowerCase();
  
  if (normalized.includes('smokey') || normalized.includes('dramatic')) {
    return DEEPAR_EFFECTS.MASK;
  }
  
  if (normalized.includes('natural') || normalized.includes('glow')) {
    return DEEPAR_EFFECTS.BEAUTY;
  }
  
  if (normalized.includes('bridal') || normalized.includes('wedding')) {
    return DEEPAR_EFFECTS.FLOWERS;
  }
  
  if (normalized.includes('bold') || normalized.includes('party')) {
    return DEEPAR_EFFECTS.GALAXY;
  }
  
  return DEEPAR_EFFECTS.BEAUTY; // Default to beauty filter
}

// Load DeepAR module dynamically (for SSR safety)
export async function loadDeepARModule(): Promise<DeepARSDK | null> {
  try {
    if (!deeparModule) {
      deeparModule = await import('deepar');
    }
    return deeparModule;
  } catch (error) {
    console.error('Failed to load DeepAR module:', error);
    return null;
  }
}
