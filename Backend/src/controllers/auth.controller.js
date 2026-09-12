import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

export async function register(req, res) {
	try {
		const { username, email, password, role } = req.body;

		if (!username || !email || !password) {
			return res.status(400).json({
				message: "Information required",
			});
		}

		const alreadyExists = await userModel.exists({
			$or: [{ username }, { email }],
		});

		if (alreadyExists !== null) {
			return res.status(409).json({
				message: "Already exists",
			});
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const newUser = await userModel.create({
			username,
			email,
			password: hashedPassword,
			role,
		});

		const jwtToken = jwt.sign(
			{
				id: newUser._id,
				role: newUser.role,
			},
			config.JWT,
			{
				expiresIn: "7d",
			},
		);

		res.cookie("token", jwtToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
			path: "/",
		});

		return res.status(201).json({
			message: "User created successfully",
			user: {
				id: newUser._id,
				username: newUser.username,
				email: newUser.email,
				role: newUser.role,
			},
		});
	} catch (err) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: err.message,
		});
	}
}

export async function login(req, res) {
	try {
		const { username, email, password } = req.body;

		if (!password || (!email && !username)) {
			return res.status(400).json({
				message: "Invalid Credentials",
			});
		}

		const searchConditions = [];
		if (username) searchConditions.push({ username });
		if (email) searchConditions.push({ email });

		const user = await userModel.findOne({ $or: searchConditions });

		if (!user) {
			return res.status(400).json({
				message: "User not found",
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			});
		}

		const token = jwt.sign(
			{
				id: user._id,
				role: user.role,
			},
			config.JWT,
			{
				expiresIn: "7d",
			},
		);

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
			path: "/",
		});

		return res.status(200).json({
			message: "Logged In successful",
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
		});
	} catch (err) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: err.message,
		});
	}
}

export async function logout(req, res) {
	res.clearCookie("token");
	res.status(200).json({
		message: "Logged Out",
	});
}
