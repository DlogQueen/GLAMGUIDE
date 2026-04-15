'use client';

// Tessi TTS Service using Web Speech API (built-in, free, unlimited)
// Piper WASM can be added later for even better quality

interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

class TTSService {
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isEnabled: boolean = true;
  private preferredVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();
      
      // Chrome loads voices asynchronously
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synthesis) return;
    
    this.voices = this.synthesis.getVoices();
    
    // Pick the most feminine-sounding English voice available (varies by OS/browser).
    const preferred = [
      "Google UK English Female",
      "Google US English",
      "Samantha",
      "Victoria",
      "Karen",
      "Moira",
      "Tessa",
      "Ava",
      "Serena",
      "Zira",
      "Hazel",
    ].map((s) => s.toLowerCase());

    const avoid = ["daniel", "alex", "fred", "anton", "tom", "jorge", "microsoft david"].map((s) =>
      s.toLowerCase()
    );

    const scoreVoice = (v: SpeechSynthesisVoice) => {
      const name = (v.name || "").toLowerCase();
      const lang = (v.lang || "").toLowerCase();
      let score = 0;

      if (lang.startsWith("en")) score += 10;
      if (lang === "en-us") score += 2;
      if (name.includes("female")) score += 8;
      if (preferred.some((p) => name.includes(p))) score += 6;
      if (avoid.some((a) => name.includes(a))) score -= 6;
      if (name.includes("siri")) score += 3;

      return score;
    };

    const ranked = [...this.voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    this.preferredVoice = ranked[0] || null;
  }

  speak(text: string, options: TTSOptions = {}) {
    if (!this.synthesis || !this.isEnabled) return;
    
    // Stop any current speech
    this.synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    utterance.voice = options.voice || this.preferredVoice;
    
    // Set options with defaults optimized for Tessi
    utterance.rate = options.rate ?? 1.0; // Natural pace
    utterance.pitch = options.pitch ?? 1.2; // More feminine by default
    utterance.volume = options.volume ?? 1.0;
    
    // Add some personality with pauses for punctuation
    utterance.text = this.addNaturalPauses(text);
    
    this.synthesis.speak(utterance);
  }

  private addNaturalPauses(text: string): string {
    // Add slight pauses for punctuation to sound more natural
    return text
      .replace(/\!/g, '! ')
      .replace(/\?/g, '? ')
      .replace(/\./g, '. ')
      .replace(/\,/g, ', ');
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  pause() {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  isTTSEnabled(): boolean {
    return this.isEnabled;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  // Check if TTS is supported
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

export const ttsService = new TTSService();
