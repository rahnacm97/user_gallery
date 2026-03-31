import { Router } from "express";
import multer from "multer";
import { GalleryController } from "../controllers/GalleryController";
import { GalleryService } from "../services/GalleryService";
import { GalleryRepository } from "../repositories/GalleryRepository";
import { authMiddleware } from "../middlewares/authMiddleware";
import { GalleryMapper } from "../mappers/GalleryMapper";
import { CloudinaryService } from "../services/CloudinaryService";

const router = Router();
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("INVALID_FILE_TYPE"));
    }
  },
});
//Dependencies
const galleryRepository = new GalleryRepository();
const galleryMapper = new GalleryMapper();
const cloudinaryService = new CloudinaryService();
const galleryService = new GalleryService(
  galleryRepository,
  galleryMapper,
  cloudinaryService,
);
//Controller
const galleryController = new GalleryController(galleryService);

router.use(authMiddleware);

//Routes
router.post("/upload", upload.array("images"), galleryController.uploadImages);
router.get("/", galleryController.getGallery);
router.put("/:id", upload.single("image"), galleryController.updateItem);
router.delete("/:id", galleryController.deleteItem);
router.post("/reorder", galleryController.saveOrder);

export default router;
