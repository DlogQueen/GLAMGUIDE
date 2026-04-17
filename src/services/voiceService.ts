"use client";

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Premium female voice IDs from ElevenLabs
// Updated: Young, American, no accent voices for Tessi
export const VOICE_OPTIONS = {
  // 🌟 TESSI'S VOICE - Young, American, energetic
  DOMI: 'AZnzlk1XvdvUeBnXmlld',     // Young, energetic, American (TESSI'S DEFAULT)
  BELLA: 'XB0fDUnXU5powFXDhCwa',     // Warm, friendly, young American
  RACHEL: '21m00Tcm4TlvDq8ikWAM',   // Clear, neutral American (slightly older)
  ANTONI: 'ErXwobaYiN019PkySvj',     // Smooth, calm (male - backup)
  // Alternative young voices
  ELLI: 'MF3mGyEYCl7XYWbV9V6O',      // Soft, gentle
  GLINDA: 'z9fAnlYsNu4n9ND14FKN',   // Very young, upbeat, American (21yo vibe)
  ALICE: 'Xb7hH8MSUJpSbSDYk0k2',    // Young, friendly, neutral American
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
  voiceId: string = VOICE_OPTIONS.DOMI,  // Tessi: Young, American, energetic
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
// Uses young, American female voice
export function speakWithBrowserTTS(
  text: string,
  onEnd?: () => void
): void {
  if (!('speechSynthesis' in window)) {
    console.error('Browser TTS not supported');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Get voices and select young American female voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoices = [
    { name: 'Samantha', lang: 'en-US' },      // macOS - Young, friendly
    { name: 'Victoria', lang: 'en-US' },      // macOS - Young
    { name: 'Ava', lang: 'en-US' },           // macOS - Premium young
    { name: 'Zira', lang: 'en-US' },          // Windows - Young
    { name: 'Google US English', lang: 'en-US' }, // Chrome
  ];
  
  // Find best matching voice
  let selectedVoice = null;
  for (const preferred of preferredVoices) {
    selectedVoice = voices.find(v => 
      v.name.toLowerCase().includes(preferred.name.toLowerCase()) && 
      v.lang === preferred.lang
    );
    if (selectedVoice) break;
  }
  
  // Fallback to any en-US female voice
  if (!selectedVoice) {
    selectedVoice = voices.find(v => 
      v.lang === 'en-US' && 
      (v.name.toLowerCase().includes('female') || !v.name.toLowerCase().includes('male'))
    );
  }
  
  // Last resort: any en-US
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang === 'en-US') || voices[0];
  }
  
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  
  // Young, energetic American settings
  utterance.rate = 1.05;    // Slightly faster
  utterance.pitch = 1.35;   // Higher pitch for younger sound
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
