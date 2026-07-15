import { useCallback } from 'react';
import { useScanContext } from '../context/ScanContext';
import type { CropImage } from '../types/crop';
import { uid } from '../utils/helpers';
import { isImageFile } from '../utils/validators';
import { MAX_SCAN_IMAGES, MAX_IMAGE_SIZE_MB } from '../utils/constants';

interface UseUploadResult {
  images: CropImage[];
  addFiles: (files: FileList | File[]) => string | null; // returns an error message or null
  removeImage: (id: string) => void;
  clear: () => void;
}

export function useUpload(): UseUploadResult {
  const { images, setImages } = useScanContext();

  const addFiles = useCallback(
    (files: FileList | File[]): string | null => {
      const list = Array.from(files);
      const invalid = list.find((f) => !isImageFile(f));
      if (invalid) return `"${invalid.name}" is not an image.`;
      const tooBig = list.find((f) => f.size > MAX_IMAGE_SIZE_MB * 1024 * 1024);
      if (tooBig) return `"${tooBig.name}" is larger than ${MAX_IMAGE_SIZE_MB} MB.`;
      if (images.length + list.length > MAX_SCAN_IMAGES) {
        return `You can upload up to ${MAX_SCAN_IMAGES} images per scan.`;
      }
      const next: CropImage[] = list.map((file) => ({
        id: uid('img'),
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
      }));
      setImages([...images, ...next]);
      return null;
    },
    [images, setImages],
  );

  const removeImage = useCallback(
    (id: string) => {
      const target = images.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      setImages(images.filter((img) => img.id !== id));
    },
    [images, setImages],
  );

  const clear = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
  }, [images, setImages]);

  return { images, addFiles, removeImage, clear };
}
