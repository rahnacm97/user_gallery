import mongoose, { Schema } from "mongoose";
import { IGalleryItem } from "interfaces/schema/IGallery";

const GallerySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  orderIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGalleryItem>("Gallery", GallerySchema);
