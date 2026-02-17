import { IGalleryItem } from "../interfaces/schema/IGallery";
import { GalleryItemDTO } from "../dtos/GalleryDTO";
import { IGalleryMapper } from "../interfaces/mappers/IGalleryMapper";

export class GalleryMapper implements IGalleryMapper {
  toDTO(item: IGalleryItem): GalleryItemDTO {
    return {
      id: item._id.toString(),
      userId: item.userId.toString(),
      title: item.title,
      imageUrl: item.imageUrl,
      orderIndex: item.orderIndex,
      createdAt: item.createdAt,
    };
  }

  toDTOList(items: IGalleryItem[]): GalleryItemDTO[] {
    return items.map((item) => this.toDTO(item));
  }
}
