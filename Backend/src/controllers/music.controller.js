import jwt from "jsonwebtoken";
import config from "../config/config.js";
import musicModel from "../models/music.model.js";
import uploadFile from "../services/storage.service.js";
import albumModel from "../models/album.model.js";
import { mongo } from "mongoose";

export async function createMusic(req, res) {
	try {
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
			artist: req.user.id,
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

export async function createAlbum(req, res) {
	try {
		const { title, musics } = req.body;
		const album = await albumModel.create({
			title,
			musics,
			artist: req.user.id,
		});

		return res.status(201).json({
			message: "Album created successfully",
			album: {
				title: album.title,
				artist: album.artist,
				music: album.musics,
			},
		});
	} catch (err) {
		return res.status(401).json({
			message: "Unauthorized",
			error: err,
		});
	}
}

export async function getAllMusics(req, res) {
	const musics = await musicModel
		.find()
		.limit(20)
		.populate("artist", "username email");

	return res.status(200).json({
		message: "All musics",
		musics,
	});
}

export async function getAllAlbums(req, res) {
	const albums = await albumModel
		.find()
		.limit(10)
		.select("title artist")
		.populate("artist", "username email ");

	return res.status(200).json({
		message: "All albums",
		albums,
	});
}

export async function getAlbumById(req, res) {
	const albumId = req.params.albumId;
	const album = await albumModel
		.findById(albumId)
		.populate("artist", "username email");

	if (!album) {
		return res.status(400).json({
			message: "No such album",
		});
	}

	return res.status(200).json({
		message: "Album fetched successfully",
		album,
	});
}
