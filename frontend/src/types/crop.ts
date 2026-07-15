export type CropType = 'rice' | 'wheat' | 'potato' | 'tomato' | 'jute' | 'maize';

export interface CropImage {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  sizeKb: number;
}
