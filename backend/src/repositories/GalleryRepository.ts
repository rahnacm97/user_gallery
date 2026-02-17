import mongoose from "mongoose";
import { IGalleryItem } from "../interfaces/schema/IGallery";
import { IGalleryRepository } from "../interfaces/repository/IGalleryRepository";
import Gallery from "../models/Gallery";

export class GalleryRepository implements IGalleryRepository {
  async create(item: Partial<IGalleryItem>): Promise<IGalleryItem> {
    const galleryItem = new Gallery(item);
    return await galleryItem.save();
  }

  async update(
    id: string,
    item: Partial<IGalleryItem>,
  ): Promise<IGalleryItem | null> {
    return await Gallery.findByIdAndUpdate(id, item, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Gallery.findByIdAndDelete(id);
    return result !== null;
  }

  async find(item: Partial<IGalleryItem>): Promise<IGalleryItem[]> {
    return await Gallery.find(item as mongoose.QueryFilter<IGalleryItem>).sort({
      orderIndex: 1,
    });
  }

  async findOne(id: string): Promise<IGalleryItem | null> {
    return await Gallery.findById(id);
  }

  async findByUser(userId: string): Promise<IGalleryItem[]> {
    return await Gallery.find({ userId }).sort({ orderIndex: 1 });
  }

  async updateOrder(
    items: { id: string; orderIndex: number }[],
  ): Promise<void> {
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { orderIndex: item.orderIndex },
      },
    }));
    await Gallery.bulkWrite(bulkOps);
  }
}
