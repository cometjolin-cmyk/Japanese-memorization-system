/**
 * High-fidelity Japanese Audio Engine
 * Combines Google Natural Native Audio with intelligent Web Speech Synthesis fallback
 */

export type VoiceEngineType = 'google_natural' | 'system_female' | 'system_male';

let currentEngine: VoiceEngineType = 'google_natural';
let currentAudioElement: HTMLAudioElement | null = null;

// Voice caches
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesInitialized = false;

function refreshVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  cachedVoices = window.speechSynthesis.getVoices();
  voicesInitialized = cachedVoices.length > 0;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  refreshVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
}

/**
 * Find best matching browser voice for Japanese
 */
function getBestSystemVoice(preferredGender: 'female' | 'male' = 'female'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  if (!voicesInitialized) refreshVoices();

  const jaVoices = cachedVoices.filter(
    (v) => v.lang.toLowerCase() === 'ja-jp' || v.lang.toLowerCase().startsWith('ja')
  );

  if (jaVoices.length === 0) {
    return null;
  }

  // Rank voices by quality and naturalness
  const femaleKeywords = ['nanami', 'ayumi', 'haruka', 'kyoko', 'siri', 'female', 'google 日本語', 'natural', 'online'];
  const maleKeywords = ['keita', 'ichiro', 'otoya', 'male', 'natural', 'online'];

  const targetKeywords = preferredGender === 'female' ? femaleKeywords : maleKeywords;

  // 1. Try finding target gender high-quality neural voice
  for (const kw of targetKeywords) {
    const match = jaVoices.find((v) => v.name.toLowerCase().includes(kw));
    if (match) return match;
  }

  // 2. Try finding any Google or Microsoft Natural voice
  const naturalMatch = jaVoices.find(
    (v) =>
      v.name.includes('Google') ||
      v.name.includes('Natural') ||
      v.name.includes('Online') ||
      v.name.includes('Kyoko') ||
      v.name.includes('Otoya')
  );
  if (naturalMatch) return naturalMatch;

  // 3. Fallback to any ja voice
  return jaVoices[0] || null;
}

/**
 * Convert any romaji or annotated text into clean Japanese kana for pristine pronunciation
 */
function cleanTextForJapaneseTTS(text: string): string {
  let cleaned = text.trim();

  // Strip English parenthetical guides like "ji (di)" -> "ji", "0 (zero)" -> "0"
  cleaned = cleaned.replace(/\s*\([a-zA-Z\s\/\-]+\)/g, '');

  // Convert slashes to pauses
  cleaned = cleaned.replace(/[\/／]/g, '、');

  // If input is purely romaji letters like "so", "shi", "tsu", "n", "a", "ka", map to authentic kana
  const romajiMap: Record<string, string> = {
    'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
    'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
    'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
    'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
    'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
    'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
    'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
    'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
    'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
    'wa': 'わ', 'wo': 'を', 'n': 'ん',
    'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
    'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
    'da': 'だ', 'de': 'で', 'do': 'ど',
    'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
    'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
  };

  const lower = cleaned.toLowerCase();
  if (romajiMap[lower]) {
    return romajiMap[lower];
  }

  return cleaned;
}

/**
 * Audio element cache for natural Google TTS
 */
const audioCache = new Map<string, HTMLAudioElement>();

function playGoogleNaturalTTS(text: string, rate: number = 0.9): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Stop previous audio if still playing
      if (currentAudioElement) {
        currentAudioElement.pause();
        currentAudioElement.currentTime = 0;
      }

      // Encode clean Japanese text
      const cleanText = cleanTextForJapaneseTTS(text);
      const cacheKey = `${cleanText}_${rate}`;

      let audio = audioCache.get(cacheKey);
      if (!audio) {
        // Google Translate TTS endpoint provides authentic studio-quality Tokyo Japanese native pronunciation
        const encoded = encodeURIComponent(cleanText);
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encoded}`;
        audio = new Audio(url);
        audioCache.set(cacheKey, audio);
      }

      currentAudioElement = audio;
      audio.playbackRate = Math.max(0.6, Math.min(rate, 1.4));

      let resolved = false;
      const onDone = () => {
        if (!resolved) {
          resolved = true;
          resolve(true);
        }
      };

      const onError = () => {
        if (!resolved) {
          resolved = true;
          resolve(false); // Signal fallback needed
        }
      };

      audio.onended = onDone;
      audio.onerror = onError;

      // Timeout fallback in case network blocks external audio
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(false);
        }
      }, 3500);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            clearTimeout(timeoutId);
          })
          .catch((err) => {
            clearTimeout(timeoutId);
            onError();
          });
      }
    } catch (e) {
      resolve(false);
    }
  });
}

function playSpeechSynthesis(text: string, rate: number = 0.9, gender: 'female' | 'male' = 'female'): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const clean = cleanTextForJapaneseTTS(text);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'ja-JP';
      // Normalize speech rate to keep pitch smooth and natural
      utterance.rate = Math.max(0.7, Math.min(rate, 1.15));
      utterance.pitch = 1.0;

      const voice = getBestSystemVoice(gender);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
      resolve();
    }
  });
}

/**
 * Main Speak Function
 * Plays with Google Natural Native TTS first; seamlessly falls back to high quality system neural voice
 */
export async function speakJapanese(
  text: string,
  rate: number = 0.9,
  engineOverride?: VoiceEngineType
): Promise<void> {
  const engine = engineOverride || currentEngine;

  if (typeof window === 'undefined') return;

  // If set to Google Natural (Default & Most Natural)
  if (engine === 'google_natural') {
    const success = await playGoogleNaturalTTS(text, rate);
    if (!success) {
      // Fallback to top system natural voice
      await playSpeechSynthesis(text, rate, 'female');
    }
    return;
  }

  // System voices
  if (engine === 'system_male') {
    await playSpeechSynthesis(text, rate, 'male');
    return;
  }

  // System female
  await playSpeechSynthesis(text, rate, 'female');
}

/**
 * Stop any playing audio
 */
export function stopJapaneseSpeech(): void {
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Change global voice engine setting
 */
export function setVoiceEngine(engine: VoiceEngineType) {
  currentEngine = engine;
}

export function getVoiceEngine(): VoiceEngineType {
  return currentEngine;
}

/**
 * Web Audio API synthesizer for instant feedback sounds (no external mp3 files required)
 */
class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playCorrect() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    osc1.frequency.setValueAtTime(987.77, now + 0.1); // B5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(523.25, now); // C5
    osc2.frequency.setValueAtTime(783.99, now + 0.1); // G5

    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  }

  playWrong() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.setValueAtTime(185, now + 0.12); // F#3

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  playCelebration() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.35);
    });
  }
}

export const sfx = new SoundEffects();
