import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Icon from '../components/common/Icon';
import VoiceButton from '../components/voice/VoiceButton';
import VoiceWave from '../components/voice/VoiceWave';
import ImageUploader from '../components/upload/ImageUploader';
import UploadProgress from '../components/upload/UploadProgress';
import { useVoice } from '../hooks/useVoice';
import { useScanPolling } from '../hooks/useScanPolling';
import { useScanContext } from '../context/ScanContext';
import { startScan } from '../services/aiService';

export default function Scan() {
  const navigate = useNavigate();
  const { images, reset } = useScanContext();
  const voice = useVoice();
  const [scanId, setScanId] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const { status, error: pollError } = useScanPolling(scanId);

  // when the async pipeline finishes, open the report
  useEffect(() => {
    if (status?.stage === 'complete' && status.reportId) {
      reset();
      navigate(`/report/${status.reportId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function onAnalyze() {
    setStartError(null);
    try {
      const files = images.map((img) => img.file);
      const res = await startScan(files, voice.audioBlob ?? undefined);
      setScanId(res.scanId);
    } catch (err) {
      setStartError((err as Error).message);
    }
  }

  const running = scanId !== null && status?.stage !== 'failed' && !pollError;

  return (
    <main className="app-main">
      <div className="container">
        <div className="page-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h1>New field scan</h1>
            <p>Ask by voice, add photos, and let the AI map exactly where to treat.</p>
          </div>
        </div>

        {running && status ? (
          <Card style={{ maxWidth: 640, margin: '0 auto' }}>
            <UploadProgress status={status} />
          </Card>
        ) : (
          <div className="scan-steps">
            <Card>
              <span className="step-tag"><span className="n">1</span> Ask by voice (optional)</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
                <VoiceButton
                  recording={voice.recording}
                  onClick={voice.recording ? voice.stop : voice.start}
                  disabled={!voice.supported}
                />
                <div style={{ flex: 1, minWidth: 200 }}>
                  {voice.recording ? (
                    <>
                      <VoiceWave level={voice.level} />
                      <small className="muted">Recording… {voice.seconds}s. Tap to stop.</small>
                    </>
                  ) : voice.audioUrl ? (
                    <>
                      <audio controls src={voice.audioUrl} style={{ width: '100%' }} />
                      <Button variant="ghost" size="sm" onClick={voice.discard} style={{ marginTop: 6 }}>
                        <Icon name="x" size={14} /> Record again
                      </Button>
                    </>
                  ) : (
                    <p className="muted" style={{ margin: 0 }}>
                      Tap the microphone and describe the problem in Bangla —{' '}
                      <span className="bn">"আমার ধানের পাতায় দাগ পড়েছে"</span>
                    </p>
                  )}
                  {voice.error && <p className="form-error">{voice.error}</p>}
                  {!voice.supported && (
                    <p className="form-error">Voice recording is not supported in this browser.</p>
                  )}
                </div>
              </div>
            </Card>

            <Card>
              <span className="step-tag"><span className="n">2</span> Add crop photos</span>
              <ImageUploader />
            </Card>

            <Card style={{ textAlign: 'center' }}>
              <span className="step-tag" style={{ justifyContent: 'center' }}>
                <span className="n">3</span> Analyze
              </span>
              <p className="muted" style={{ marginTop: 0 }}>
                {images.length === 0
                  ? 'Add at least one photo to start the analysis.'
                  : `${images.length} photo${images.length > 1 ? 's' : ''} ready.`}
              </p>
              {(startError || pollError) && (
                <p className="form-error">{startError ?? pollError}</p>
              )}
              {status?.stage === 'failed' && (
                <p className="form-error">{status.error ?? 'The scan failed. Try again.'}</p>
              )}
              <Button size="lg" disabled={images.length === 0} onClick={onAnalyze}>
                <Icon name="brain" size={18} />
                Analyze my field
              </Button>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
