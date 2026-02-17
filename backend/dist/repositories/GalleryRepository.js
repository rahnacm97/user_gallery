import Gallery from "../models/Gallery";
export class GalleryRepository {
    async create(item) {
        const galleryItem = new Gallery(item);
        return await galleryItem.save();
    }
    async update(id, item) {
        return await Gallery.findByIdAndUpdate(id, item, { new: true });
    }
    async delete(id) {
        const result = await Gallery.findByIdAndDelete(id);
        return result !== null;
    }
    async find(item) {
        return await Gallery.find(item).sort({
            orderIndex: 1,
        });
    }
    async findOne(id) {
        return await Gallery.findById(id);
    }
    async findByUser(userId) {
        return await Gallery.find({ userId }).sort({ orderIndex: 1 });
    }
    async updateOrder(items) {
        const bulkOps = items.map((item) => ({
            updateOne: {
                filter: { _id: item.id },
                update: { orderIndex: item.orderIndex },
            },
        }));
        await Gallery.bulkWrite(bulkOps);
    }
}
