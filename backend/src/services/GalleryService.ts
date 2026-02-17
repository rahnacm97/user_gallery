import mongoose from "mongoose";
import { IGalleryRepository } from "../interfaces/repository/IGalleryRepository";
import { IGalleryItem } from "../interfaces/schema/IGallery";
import { ApiError } from "../shared/utils/ApiError";
import { HttpStatus } from "../shared/constants/httpStatus";
import { ErrorMessages } from "../shared/constants/messages";
import { logger } from "../shared/utils/logger";
import { IGalleryService } from "../interfaces/services/IGalleryService";
import { IGalleryMapper } from "../interfaces/mappers/IGalleryMapper";
import { GalleryItemDTO } from "../dtos/GalleryDTO";
import { IImageUploadService } from "../interfaces/services/IImageUploadService";

export class GalleryService implements IGalleryService {
  constructor(
    private _galleryRepository: IGalleryRepository,
    private _galleryMapper: IGalleryMapper,
    private _imageUploadService: IImageUploadService,
  ) {}
  //Image uploading
  async uploadImages(
    userId: string,
    files: Express.Multer.File[],
    titles: string[],
  ): Promise<GalleryItemDTO[]> {
    const items: IGalleryItem[] = [];
    const existingItems = await this._galleryRepository.findByUser(userId);
    let nextOrderIndex = existingItems.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = titles[i] || "Untitled";

      logger.info(`Uploading file ${i + 1}/${files.length}: ${file.path}`);

      const secureUrl = await this._imageUploadService.upload(
        file.path,
        "user_gallery",
      );

      const newItem = await this._galleryRepository.create({
        userId: userId as unknown as mongoose.Types.ObjectId,
        title,
        imageUrl: secureUrl,
        orderIndex: nextOrderIndex++,
      });
      items.push(newItem);
    }
    return this._galleryMapper.toDTOList(items);
  }
  //Fetch user gallery
  async getGallery(userId: string): Promise<GalleryItemDTO[]> {
    const items = await this._galleryRepository.findByUser(userId);
    return this._galleryMapper.toDTOList(items);
  }
  //Update image
  async updateItem(
    id: string,
    userId: string,
    data: { title?: string; file?: Express.Multer.File },
  ): Promise<GalleryItemDTO | null> {
    const item = await this._galleryRepository.findOne(id);
    if (!item || item.userId.toString() !== userId) {
      throw new ApiError(HttpStatus.NOT_FOUND, ErrorMessages.ITEM_NOT_FOUND);
    }

    const updates: Partial<IGalleryItem> = {};
    if (data.title) updates.title = data.title;

    if (data.file) {
      const secureUrl = await this._imageUploadService.upload(
        data.file.path,
        "user_gallery",
      );
      updates.imageUrl = secureUrl;
    }

    const updatedItem = await this._galleryRepository.update(id, updates);
    return updatedItem ? this._galleryMapper.toDTO(updatedItem) : null;
  }
  //Delete image
  async deleteItem(id: string, userId: string): Promise<boolean> {
    const item = await this._galleryRepository.findOne(id);
    if (!item || item.userId.toString() !== userId) {
      throw new ApiError(HttpStatus.NOT_FOUND, ErrorMessages.ITEM_NOT_FOUND);
    }

    return await this._galleryRepository.delete(id);
  }
  //Save
  async saveOrder(
    userId: string,
    orderData: { id: string; orderIndex: number }[],
  ): Promise<void> {
    await this._galleryRepository.updateOrder(orderData);
  }
}
