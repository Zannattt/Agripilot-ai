import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CropImage } from '../types/crop';

interface ScanContextValue {
  images: CropImage[];
  setImages: (images: CropImage[]) => void;
  voiceBlob: Blob | null;
  setVoiceBlob: (blob: Blob | null) => void;
  transcript: string;
  setTranscript: (t: string) => void;
  reset: () => void;
}

const ScanContext = createContext<ScanContextValue | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<CropImage[]>([]);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');

  function reset() {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setVoiceBlob(null);
    setTranscript('');
  }

  return (
    <ScanContext.Provider
      value={{ images, setImages, voiceBlob, setVoiceBlob, transcript, setTranscript, reset }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScanContext(): ScanContextValue {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScanContext must be used inside ScanProvider');
  return ctx;
}
