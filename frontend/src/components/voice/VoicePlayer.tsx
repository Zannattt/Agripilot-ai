import { useEffect, useRef, useState } from 'react';
import Icon from '../common/Icon';
import Button from '../common/Button';
import { speakFallback, stopSpeaking } from '../../services/voiceService';

interface VoicePlayerProps {
  /** URL of backend-generated audio (ElevenLabs). Null in mock mode. */
  audioUrl: string | null;
  /** Bangla text used for browser TTS fallback when audioUrl is null. */
  fallbackTextBn: string;
}

export default function VoicePlayer({ audioUrl, fallbackTextBn }: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => stopSpeaking(), []);

  function toggle() {
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setPlaying(false);
      }
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
      return;
    }
    // mock fallback: browser speech synthesis
    if (playing) {
      stopSpeaking();
      setPlaying(false);
    } else {
      const ok = speakFallback(fallbackTextBn);
      setPlaying(ok);
      if (ok) {
        // speechSynthesis has no reliable end event across browsers for long text;
        // reset the button after a generous window.
        setTimeout(() => setPlaying(false), 15000);
      }
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Button variant="secondary" size="sm" onClick={toggle}>
        <Icon name={playing ? 'pause' : 'play'} size={15} />
        {playing ? 'Pause' : 'Listen in Bangla'}
      </Button>
      {!audioUrl && (
        <small className="muted">Demo uses your browser's Bangla voice if available.</small>
      )}
    </div>
  );
}
