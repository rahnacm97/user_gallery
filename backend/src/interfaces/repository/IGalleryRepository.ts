import { IGalleryItem } from "interfaces/schema/IGallery";
import { IBaseRepository } from "./IBaseRepository";

export interface IGalleryRepository extends IBaseRepository<IGalleryItem> {
  findByUser(userId: string): Promise<IGalleryItem[]>;
  updateOrder(items: { id: string; orderIndex: number }[]): Promise<void>;
}
