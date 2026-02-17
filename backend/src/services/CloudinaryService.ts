import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { IImageUploadService } from "../interfaces/services/IImageUploadService";
import { logger } from "../shared/utils/logger";

export class CloudinaryService implements IImageUploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  //Image uploading
  async upload(filePath: string, folder: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
      });

      logger.info(`Cloudinary result: ${result.secure_url}`);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return result.secure_url;
    } catch (error) {
      logger.error("Cloudinary upload failed:", error);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  //Image deleting
  async delete(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error) {
      logger.error("Cloudinary delete failed:", error);
      return false;
    }
  }
}
