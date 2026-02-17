import { HttpStatus } from "../shared/constants/httpStatus";
import { SuccessMessages, ErrorMessages } from "../shared/constants/messages";
export class GalleryController {
    _galleryService;
    constructor(_galleryService) {
        this._galleryService = _galleryService;
    }
    //Uploading images
    uploadImages = async (req, res) => {
        const userId = req.user.userId;
        const files = req.files;
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
        const items = await this._galleryService.uploadImages(userId, files, titles);
        res
            .status(HttpStatus.CREATED)
            .json({ message: SuccessMessages.UPLOAD_SUCCESS, items });
    };
    // fetch gallery
    getGallery = async (req, res) => {
        const userId = req.user.userId;
        const items = await this._galleryService.getGallery(userId);
        res.status(HttpStatus.OK).json(items);
    };
    //Update image
    updateItem = async (req, res) => {
        const id = req.params.id;
        const userId = req.user.userId;
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
    deleteItem = async (req, res) => {
        const id = req.params.id;
        const userId = req.user.userId;
        await this._galleryService.deleteItem(id, userId);
        res.status(HttpStatus.OK).json({ message: SuccessMessages.DELETE_SUCCESS });
    };
    //Saving
    saveOrder = async (req, res) => {
        const userId = req.user.userId;
        const { orderData } = req.body;
        await this._galleryService.saveOrder(userId, orderData);
        res.status(HttpStatus.OK).json({ message: SuccessMessages.ORDER_SAVED });
    };
}
