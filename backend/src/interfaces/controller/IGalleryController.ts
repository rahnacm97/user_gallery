import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";

export interface IGalleryController {
  uploadImages(req: AuthRequest, res: Response): Promise<void>;
  getGallery(req: AuthRequest, res: Response): Promise<void>;
  updateItem(req: AuthRequest, res: Response): Promise<void>;
  deleteItem(req: AuthRequest, res: Response): Promise<void>;
  saveOrder(req: AuthRequest, res: Response): Promise<void>;
}
