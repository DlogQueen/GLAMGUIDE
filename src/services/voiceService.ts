"use client";

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Premium female voice IDs from ElevenLabs
export const VOICE_OPTIONS = {
  // Professional makeup artist style voices
  BELLA: 'XB0fDUnXU5powFXDhCwa',     // Warm, friendly female
  RACHEL: '21m00Tcm4TlvDq8ikWAM',   // Professional, clear
  DOMI: 'AZnzlk1XvdvUeBnXmlld',     // Energetic, young
  ANTONI: 'ErXwobaYiN019PkySvj',     // Smooth, calm (male - backup)
  ELLI: 'MF3mGyEYCl7XYWbV9V6O',      // Soft, gentle
  // Premium voices (if subscribed)
  SARAH: 'EXAVITQu4vr4xnSDxMaL',    // News anchor style
  LAURA: 'FGY2WhTYpPnrIDTdsKH5',    // Conversational, warm
};

export interface VoiceSettings {
  stability: number;      // 0-1, higher = more consistent
  similarity_boost: number; // 0-1, higher = closer to original voice
  style: number;          // 0-1, style exaggeration
  use_speaker_boost: boolean;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.3,
  use_speaker_boost: true,
};

export async function generateSpeech(
  text: string,
  voiceId: string = VOICE_OPTIONS.ELLI,
  settings: VoiceSettings = DEFAULT_SETTINGS
): Promise<string | null> {
  if (!ELEVENLABS_API_KEY) {
    console.error('ElevenLabs API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: settings,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', error);
      return null;
    }

    // Convert stream to blob URL
    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Failed to generate speech:', error);
    return null;
  }
}

export function playAudio(audioUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.onended = () => resolve();
    audio.onerror = reject;
    audio.play();
  });
}

// Fallback to browser TTS if ElevenLabs fails
export function speakWithBrowserTTS(
  text: string,
  onEnd?: () => void
): void {
  if (!('speechSynthesis' in window)) {
    console.error('Browser TTS not supported');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Get voices and select female one
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(v => 
    v.name.includes('Female') || 
    v.name.includes('Samantha') || 
    v.name.includes('Victoria') ||
    v.name.includes('Karen') ||
    v.name.includes('Google US English')
  ) || voices.find(v => v.lang === 'en-US') || voices[0];
  
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }
  
  utterance.rate = 0.92;
  utterance.pitch = 1.25;
  utterance.volume = 1.0;
  
  if (onEnd) {
    utterance.onend = onEnd;
  }
  
  window.speechSynthesis.speak(utterance);
}

// Main function: tries ElevenLabs first, falls back to browser TTS
export async function speakWithPremiumVoice(
  text: string,
  onEnd?: () => void
): Promise<boolean> {
  // Try ElevenLabs first
  const audioUrl = await generateSpeech(text);
  
  if (audioUrl) {
    try {
      await playAudio(audioUrl);
      onEnd?.();
      return true;
    } catch (error) {
      console.warn('ElevenLabs playback failed, using fallback:', error);
    }
  }
  
  // Fallback to browser TTS
  speakWithBrowserTTS(text, onEnd);
  return false;
}

// Get available voices from ElevenLabs (requires API key)
export async function getAvailableVoices() {
  if (!ELEVENLABS_API_KEY) return [];
  
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.voices || [];
  } catch {
    return [];
  }
}
