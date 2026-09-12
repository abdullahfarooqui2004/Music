import jwt from "jsonwebtoken";
import config from "../config/config.js";
import musicModel from "../models/music.model.js";
import uploadFile from "../services/storage.service.js";
import albumModel from "../models/album.model.js"
import { mongo } from "mongoose";

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


export async function createAlbum(req, res){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
        message: "Unauthorized Access"
        })
    }

    try {
        const decoded = jwt.verify(token, config.JWT);

        if(decoded.role !== "artist"){
            return res.status(401).json({
                message: "Forbidden: Only Artists can create music"
            })
        }

        const {title, musics} = req.body;
        const album = await albumModel.create({
            title,
            musics,
            artist: decoded.id,
        })

        return res.status(201).json({
            message: "Album created successfully",
            album: {
                title: album.title,
                artist: album.artist,
                music: album.musics
            }
        })
        
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized",
            error: err
        })
    }
}