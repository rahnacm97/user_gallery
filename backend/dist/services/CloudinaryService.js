import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { logger } from "../shared/utils/logger";
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async upload(filePath, folder) {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: folder,
            });
            logger.info(`Cloudinary result: ${result.secure_url}`);
            // Clean up local file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return result.secure_url;
        }
        catch (error) {
            logger.error("Cloudinary upload failed:", error);
            // Ensure local file is cleaned up even on error
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            throw error;
        }
    }
    async delete(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === "ok";
        }
        catch (error) {
            logger.error("Cloudinary delete failed:", error);
            return false;
        }
    }
}
