export interface UploadedFileItem {
  id: number;
  filename: string;
  mime_type: string;
  uploaded_at: string;
  sizeBytes?: number;
  previewUrl?: string;
}
