import mongoose, { Document } from "mongoose";

export interface IGalleryItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  imageUrl: string;
  orderIndex: number;
  createdAt: Date;
}
