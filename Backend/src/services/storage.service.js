import ImageKit from "@imagekit/nodejs";
import config from "../config/config.js";

const ImageKitClient = new ImageKit({
	publicKey: config.IMAGEKIT_PUBLIC || process.env.IMAGEKIT_PUBLIC,
	privateKey: config.IMAGEKIT_PRIVATE || process.env.IMAGEKIT_PRIVATE,
	urlEndpoint: config.IMAGEKIT_URI || process.env.IMAGEKIT_URI,
});

async function uploadFile(file) {
	const result = await ImageKitClient.files.upload({
		file,
		fileName: "music_" + Date.now(),
		folder: "music",
	});

	return result;
}

export default uploadFile;
