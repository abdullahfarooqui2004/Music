import { Router } from "express";
import * as musicController from "../controllers/music.controller.js";
import multer from "multer";

import * as authMiddleware from "../middlewares/auth.middleware.js";

const musicRouter = Router();
const upload = multer({
	storage: multer.memoryStorage(),
});

musicRouter.post(
	"/upload",
	authMiddleware.authArtist,
	upload.single("music"),
	musicController.createMusic,
);

musicRouter.post(
	"/create-album",
	authMiddleware.authArtist,
	musicController.createAlbum,
);

musicRouter.get("/", authMiddleware.authUser, musicController.getAllMusics);

musicRouter.get(
	"/albums",
	authMiddleware.authUser,
	musicController.getAllAlbums,
);

musicRouter.get(
	"/albums/:albumId",
	authMiddleware.authUser,
	musicController.getAlbumById,
);

export default musicRouter;
