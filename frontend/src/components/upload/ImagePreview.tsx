import type { CropImage } from '../../types/crop';

interface ImagePreviewProps {
  images: CropImage[];
  onRemove: (id: string) => void;
}

export default function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null;
  return (
    <div className="preview-row">
      {images.map((img) => (
        <figure key={img.id} className="preview-thumb" style={{ margin: 0 }}>
          <img src={img.previewUrl} alt={img.name} />
          <button type="button" onClick={() => onRemove(img.id)} aria-label={`Remove ${img.name}`}>
            ✕
          </button>
        </figure>
      ))}
    </div>
  );
}
