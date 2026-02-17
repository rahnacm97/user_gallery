export class GalleryMapper {
    toDTO(item) {
        return {
            id: item._id.toString(),
            userId: item.userId.toString(),
            title: item.title,
            imageUrl: item.imageUrl,
            orderIndex: item.orderIndex,
            createdAt: item.createdAt,
        };
    }
    toDTOList(items) {
        return items.map((item) => this.toDTO(item));
    }
}
