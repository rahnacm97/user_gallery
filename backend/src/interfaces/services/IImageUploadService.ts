export interface IImageUploadService {
  upload(filePath: string, folder: string): Promise<string>;
  delete(publicId: string): Promise<boolean>;
}
