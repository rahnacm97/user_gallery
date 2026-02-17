import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { HttpStatus } from "../shared/constants/httpStatus";
import { SuccessMessages, ErrorMessages } from "../shared/constants/messages";
import { IGalleryController } from "../interfaces/controller/IGalleryController";
import { IGalleryService } from "../interfaces/services/IGalleryService";

export class GalleryController implements IGalleryController {
  constructor(private _galleryService: IGalleryService) {}

  //Uploading images
  uploadImages = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const files = req.files as Express.Multer.File[];
    const titles = req.body.titles
      ? Array.isArray(req.body.titles)
        ? req.body.titles
        : [req.body.titles]
      : [];

    if (!files || files.length === 0) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: ErrorMessages.NO_FILES });
      return;
    }

    const items = await this._galleryService.uploadImages(
      userId,
      files,
      titles,
    );
    res
      .status(HttpStatus.CREATED)
      .json({ message: SuccessMessages.UPLOAD_SUCCESS, items });
  };
  // fetch gallery
  getGallery = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const items = await this._galleryService.getGallery(userId);
    res.status(HttpStatus.OK).json(items);
  };
  //Update image
  updateItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const { title } = req.body;
    const file = req.file;

    const item = await this._galleryService.updateItem(id, userId, {
      title,
      file,
    });
    res
      .status(HttpStatus.OK)
      .json({ message: SuccessMessages.UPDATE_SUCCESS, item });
  };
  //Delete image
  deleteItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    await this._galleryService.deleteItem(id, userId);
    res.status(HttpStatus.OK).json({ message: SuccessMessages.DELETE_SUCCESS });
  };
  //Saving
  saveOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { orderData } = req.body;

    await this._galleryService.saveOrder(userId, orderData);
    res.status(HttpStatus.OK).json({ message: SuccessMessages.ORDER_SAVED });
  };
}
