// Unified Streamer Voice Player (Gemini Audio WAV + Web Speech Fallback)

class StreamerVoiceEngine {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  private onSpeakingChangeCallbacks: Array<(speaking: boolean) => void> = [];

  public subscribe(cb: (speaking: boolean) => void) {
    this.onSpeakingChangeCallbacks.push(cb);
    return () => {
      this.onSpeakingChangeCallbacks = this.onSpeakingChangeCallbacks.filter(c => c !== cb);
    };
  }

  private setSpeaking(status: boolean) {
    this.isSpeaking = status;
    this.onSpeakingChangeCallbacks.forEach(cb => cb(status));
  }

  public getSpeaking(): boolean {
    return this.isSpeaking;
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.setSpeaking(false);
  }

  public async speak(text: string, audioUrl?: string | null): Promise<void> {
    this.stop();

    // 1. If we have Gemini TTS audio WAV data url
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;
        this.setSpeaking(true);

        audio.onended = () => {
          this.setSpeaking(false);
          this.currentAudio = null;
        };

        audio.onerror = () => {
          console.warn('Audio playback error, falling back to Web Speech synthesis');
          this.speakFallback(text);
        };

        await audio.play();
        return;
      } catch (e) {
        console.warn('Could not play audio directly, trying fallback:', e);
      }
    }

    // 2. Web Speech API fallback
    this.speakFallback(text);
  }

  private speakFallback(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      this.setSpeaking(true);
      // Simulate speaking for 3 seconds if speech API isn't present
      setTimeout(() => this.setSpeaking(false), 3000);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Pick Arabic voice if available, else standard
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.lang.includes('AR'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
      utterance.lang = arabicVoice.lang;
    } else {
      utterance.lang = 'ar-SA';
    }

    utterance.rate = 1.05;
    utterance.pitch = 1.02;

    utterance.onstart = () => {
      this.setSpeaking(true);
    };

    utterance.onend = () => {
      this.setSpeaking(false);
    };

    utterance.onerror = () => {
      this.setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const voiceEngine = new StreamerVoiceEngine();
