export class GalleryItemDTO {
  id!: string;
  userId!: string;
  title!: string;
  imageUrl!: string;
  orderIndex!: number;
  createdAt!: Date;
}

export class CreateGalleryItemDTO {
  title!: string;
  imageUrl!: string;
}
