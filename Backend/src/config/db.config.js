import mongoose from "mongoose";
import config from './config.js'


const connectDb = async () => {
	try {
		await mongoose.connect(config.MONGO);
        console.log("Database connected")
	} catch (err) {
		console.error("Error connecting to DB: ", err);
	}
};

export default connectDb;