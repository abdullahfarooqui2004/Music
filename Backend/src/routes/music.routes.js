import { Router } from "express";
import * as musicController from "../controllers/music.controller.js";
import multer from "multer";

const musicRouter = Router();
const upload = multer({
	storage: multer.memoryStorage(),
});

musicRouter.post(
	"/music/upload",
	upload.single("music"),
	musicController.createMusic,
);

export default musicRouter;
