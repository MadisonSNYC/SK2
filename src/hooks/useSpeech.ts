import { useState, useCallback, useEffect } from 'react';
import type { ColorKey } from '../types/index';
import { COLORS } from '../constants/colors';

const SPEECH_RATE = 0.72; // Slower than normal speech for clarity
const PAUSE_BETWEEN_COLORS_MS = 2000; // 2 seconds pause between each color

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number | null>(null);
  const [currentSpeakingColor, setCurrentSpeakingColor] = useState<ColorKey | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!window.speechSynthesis) {
        console.error('Speech synthesis not supported');
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = SPEECH_RATE;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        reject(event);
      };

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const speakSequence = useCallback(async (colors: ColorKey[]) => {
    if (colors.length === 0) return;

    setIsSpeaking(true);
    setCurrentSpeakingIndex(0);

    try {
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        setCurrentSpeakingIndex(i);
        setCurrentSpeakingColor(color);

        const colorName = COLORS[color].name;
        await speak(colorName);

        // 2 second pause between colors for processing time
        if (i < colors.length - 1) {
          await new Promise(resolve => setTimeout(resolve, PAUSE_BETWEEN_COLORS_MS));
        }
      }
    } catch (error) {
      console.error('Error speaking sequence:', error);
    } finally {
      setIsSpeaking(false);
      setCurrentSpeakingIndex(null);
      setCurrentSpeakingColor(null);
    }
  }, [speak]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Cancel all queued speech
    }
    setIsSpeaking(false);
    setCurrentSpeakingIndex(null);
    setCurrentSpeakingColor(null);
  }, []);

  return {
    speak,
    speakSequence,
    stop,
    isSpeaking,
    currentSpeakingIndex,
    currentSpeakingColor,
  };
}
