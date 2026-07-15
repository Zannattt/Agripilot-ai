import { useRef, useState, type DragEvent } from 'react';
import Icon from '../common/Icon';
import ImagePreview from './ImagePreview';
import { useUpload } from '../../hooks/useUpload';
import { MAX_SCAN_IMAGES } from '../../utils/constants';

export default function ImageUploader() {
  const { images, addFiles, removeImage } = useUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragover, setDragover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(addFiles(files));
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragover(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div
        className={`dropzone ${dragover ? 'dragover' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragover(true);
        }}
        onDragLeave={() => setDragover(false)}
        onDrop={onDrop}
        aria-label="Add crop photos"
      >
        <Icon name="camera" size={30} />
        <p style={{ margin: '10px 0 2px', fontWeight: 600, color: 'var(--text)' }}>
          Add crop photos
        </p>
        <p style={{ margin: 0, fontSize: '0.86rem' }}>
          Take photos from {MAX_SCAN_IMAGES} different spots of the field · JPG or PNG
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <ImagePreview images={images} onRemove={removeImage} />
    </div>
  );
}
