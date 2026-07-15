import Icon from '../common/Icon';

interface VoiceButtonProps {
  recording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function VoiceButton({ recording, onClick, disabled }: VoiceButtonProps) {
  return (
    <button
      type="button"
      className={`voice-btn ${recording ? 'recording' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={recording ? 'Stop recording' : 'Start recording your question'}
      aria-pressed={recording}
    >
      <Icon name={recording ? 'stop' : 'mic'} size={26} />
    </button>
  );
}
