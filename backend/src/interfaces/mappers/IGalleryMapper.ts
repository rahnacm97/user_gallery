import { IGalleryItem } from "../../interfaces/schema/IGallery";
import { GalleryItemDTO } from "../../dtos/GalleryDTO";

export interface IGalleryMapper {
  toDTO(item: IGalleryItem): GalleryItemDTO;
  toDTOList(items: IGalleryItem[]): GalleryItemDTO[];
}
