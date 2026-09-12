import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function authArtist(req, res, next) {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}

	try {
		const decoded = jwt.verify(token, config.JWT);

		if (decoded.role !== "artist") {
			return res.status(401).json({
				message: "Forbidden",
			});
		}

		req.user = decoded;

		next();
	} catch (err) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}
}

export async function authUser(req, res, next) {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}

	try {
		const decoded = jwt.verify(token, config.JWT);
		if (decoded.role !== "user") {
			return res.status(401).json({
				message: "Forbidden",
			});
		}

		req.user = decoded;

		next();
	} catch (error) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}
}
