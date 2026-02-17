import { ApiError } from "../shared/utils/ApiError";
import { HttpStatus } from "../shared/constants/httpStatus";
import { ErrorMessages } from "../shared/constants/messages";
import { logger } from "../shared/utils/logger";
export class GalleryService {
    _galleryRepository;
    _galleryMapper;
    _imageUploadService;
    constructor(_galleryRepository, _galleryMapper, _imageUploadService) {
        this._galleryRepository = _galleryRepository;
        this._galleryMapper = _galleryMapper;
        this._imageUploadService = _imageUploadService;
    }
    //Image uploading
    async uploadImages(userId, files, titles) {
        const items = [];
        const existingItems = await this._galleryRepository.findByUser(userId);
        let nextOrderIndex = existingItems.length;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const title = titles[i] || "Untitled";
            logger.info(`Uploading file ${i + 1}/${files.length}: ${file.path}`);
            const secureUrl = await this._imageUploadService.upload(file.path, "user_gallery");
            const newItem = await this._galleryRepository.create({
                userId: userId,
                title,
                imageUrl: secureUrl,
                orderIndex: nextOrderIndex++,
            });
            items.push(newItem);
        }
        return this._galleryMapper.toDTOList(items);
    }
    //Fetch user gallery
    async getGallery(userId) {
        const items = await this._galleryRepository.findByUser(userId);
        return this._galleryMapper.toDTOList(items);
    }
    //Update image
    async updateItem(id, userId, data) {
        const item = await this._galleryRepository.findOne(id);
        if (!item || item.userId.toString() !== userId) {
            throw new ApiError(HttpStatus.NOT_FOUND, ErrorMessages.ITEM_NOT_FOUND);
        }
        const updates = {};
        if (data.title)
            updates.title = data.title;
        if (data.file) {
            const secureUrl = await this._imageUploadService.upload(data.file.path, "user_gallery");
            updates.imageUrl = secureUrl;
        }
        const updatedItem = await this._galleryRepository.update(id, updates);
        return updatedItem ? this._galleryMapper.toDTO(updatedItem) : null;
    }
    //Delete image
    async deleteItem(id, userId) {
        const item = await this._galleryRepository.findOne(id);
        if (!item || item.userId.toString() !== userId) {
            throw new ApiError(HttpStatus.NOT_FOUND, ErrorMessages.ITEM_NOT_FOUND);
        }
        return await this._galleryRepository.delete(id);
    }
    //Save
    async saveOrder(userId, orderData) {
        await this._galleryRepository.updateOrder(orderData);
    }
}
