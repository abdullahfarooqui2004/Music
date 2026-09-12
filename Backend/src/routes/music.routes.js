import { Router } from "express";
import * as musicController from "../controllers/music.controller.js";
import multer from "multer";

const musicRouter = Router();
const upload = multer({
	storage: multer.memoryStorage(),
});

musicRouter.post(
	"/upload",
	upload.single("music"),
	musicController.createMusic,
);

musicRouter.post("/create-album", musicController.createAlbum)

export default musicRouter;
