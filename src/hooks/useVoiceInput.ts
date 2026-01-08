import { useState, useCallback, useEffect, useRef } from 'react';
import type { ColorKey } from '../types/index';
import { COLORS } from '../constants/colors';

type VoiceState = 'ready' | 'starting' | 'listening' | 'error';

// Web Speech API type declarations
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
  }
}

export function useVoiceInput(onColorDetected: (colorKey: ColorKey) => void) {
  const [voiceState, setVoiceState] = useState<VoiceState>('ready');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastHeard, setLastHeard] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Build a map of all possible color names/aliases to ColorKey
  const colorNameMap = useRef<Map<string, ColorKey>>(new Map());

  useEffect(() => {
    // Build color name map once
    Object.entries(COLORS).forEach(([key, color]) => {
      const colorKey = key as ColorKey;
      // Add main name (lowercase)
      colorNameMap.current.set(color.name.toLowerCase(), colorKey);
      // Add all aliases (lowercase)
      color.aliases?.forEach(alias => {
        colorNameMap.current.set(alias.toLowerCase(), colorKey);
      });
    });
  }, []);

  const matchColorName = useCallback((text: string): ColorKey | null => {
    const words = text.toLowerCase().split(/\s+/);

    // Try to find a color match in the transcribed words
    for (const word of words) {
      const colorKey = colorNameMap.current.get(word);
      if (colorKey) {
        return colorKey;
      }
    }

    return null;
  }, []);

  const startListening = useCallback(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceState('error');
      setErrorMessage('Voice input not supported in this browser');
      return;
    }

    setVoiceState('starting');
    setErrorMessage('');

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Continuous listening
      recognition.interimResults = true; // Get interim results
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setVoiceState('listening');
      };

      recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;

        setLastHeard(transcript);

        // Only process final results
        if (event.results[last].isFinal) {
          const matchedColor = matchColorName(transcript);
          if (matchedColor) {
            onColorDetected(matchedColor);
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setVoiceState('error');
        setErrorMessage(`Voice error: ${event.error}`);
      };

      recognition.onend = () => {
        // If we're supposed to be listening, restart
        if (voiceState === 'listening') {
          try {
            recognition.start();
          } catch (err) {
            console.error('Error restarting recognition:', err);
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Error starting recognition:', err);
      setVoiceState('error');
      setErrorMessage('Failed to start voice input');
    }
  }, [matchColorName, onColorDetected, voiceState]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setVoiceState('ready');
    setLastHeard('');
  }, []);

  const toggleListening = useCallback(() => {
    if (voiceState === 'listening') {
      stopListening();
    } else if (voiceState === 'ready' || voiceState === 'error') {
      startListening();
    }
  }, [voiceState, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    voiceState,
    errorMessage,
    lastHeard,
    toggleListening,
    isListening: voiceState === 'listening',
  };
}
