import { GalleryItemDTO } from "../../dtos/GalleryDTO";

export interface IGalleryService {
  uploadImages(
    userId: string,
    files: Express.Multer.File[],
    titles: string[],
  ): Promise<GalleryItemDTO[]>;
  getGallery(userId: string): Promise<GalleryItemDTO[]>;
  updateItem(
    id: string,
    userId: string,
    data: { title?: string; file?: Express.Multer.File },
  ): Promise<GalleryItemDTO | null>;
  deleteItem(id: string, userId: string): Promise<boolean>;
  saveOrder(
    userId: string,
    orderData: { id: string; orderIndex: number }[],
  ): Promise<void>;
}
