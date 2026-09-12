import jwt from "jsonwebtoken";
import config from "../config/config.js";
import musicModel from "../models/music.model.js";
import uploadFile from "../services/storage.service.js";

export async function createMusic(req, res) {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}

	try {
		const decoded = jwt.verify(token, config.JWT);
		if (decoded.role !== "artist") {
			return res.status(409).json({
				message: "Forbidden: Only Artists can create music",
			});
		}

		const { title } = req.body;
		const file = req.file;

		if (!file) {
			return res.status(400).json({
				message: "No file uploaded",
			});
		}

		if (!title) {
			return res.status(400).json({
				message: "Title is required",
			});
		}

		const result = await uploadFile(file.buffer.toString("base64"));

		const music = await musicModel.create({
			uri: result.url,
			title,
			artist: decoded.id,
		});

		return res.status(201).json({
			message: "Music uploaded successfully",
			uri: music.url,
			title: music.title,
			artist: music.artist,
		});
	} catch (err) {
		console.error("Music upload error:", err);
		return res.status(500).json({
			message: "Something went wrong",
			error: err.message,
		});
	}
}
