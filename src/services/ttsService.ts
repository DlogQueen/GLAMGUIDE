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
    
    // Pick young, American female voice (no accent) for Tessi
    const preferred = [
      // 🇺🇸 American voices (young, no accent)
      "Samantha",           // macOS - Young, friendly American
      "Victoria",           // macOS - Young, American
      "Google US English",  // Chrome - Neutral American
      "Ava",                // macOS - Premium, young American
      "Zira",               // Windows - Young American
      "Microsoft Aria",     // Windows - Young, energetic
      // Fallbacks (avoid UK/accents)
      "Google UK English Female",
      "Serena",
      "Moira",
      "Karen",
      "Tessa",
    ].map((s) => s.toLowerCase());

    const avoid = ["daniel", "alex", "fred", "anton", "tom", "jorge", "microsoft david"].map((s) =>
      s.toLowerCase()
    );

    const scoreVoice = (v: SpeechSynthesisVoice) => {
      const name = (v.name || "").toLowerCase();
      const lang = (v.lang || "").toLowerCase();
      let score = 0;

      // American English = highest priority
      if (lang === "en-us") score += 20;       // Strong preference for US English
      if (lang.startsWith("en")) score += 10;  // Any English
      
      // Prefer known young female voices
      const youngAmericans = ["samantha", "victoria", "ava", "zira", "microsoft aria"];
      if (youngAmericans.some((yv) => name.includes(yv))) score += 15;
      
      if (name.includes("female")) score += 8;
      if (preferred.some((p) => name.includes(p))) score += 6;
      if (avoid.some((a) => name.includes(a))) score -= 6;
      
      // Avoid UK/british accents
      if (name.includes("uk") || name.includes("british") || name.includes("daniel")) score -= 10;
      
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
    
    // Set options for Tessi: Young, energetic American voice
    utterance.rate = options.rate ?? 1.05;   // Slightly faster (young/energetic)
    utterance.pitch = options.pitch ?? 1.35; // Higher pitch (younger sound)
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
