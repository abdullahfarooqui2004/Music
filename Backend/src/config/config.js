import dotenv from 'dotenv'

dotenv.config()

if(!process.env.JWT_SECRET || !process.env.MONGODB){
    console.error("Error with environment variables")
}

if(!process.env.IMAGEKIT_PRIVATE || !process.env.IMAGEKIT_PUBLIC || !process.env.IMAGEKIT_URI)
    console.error("Error with storage configuration variables")

const config = {
	PORT: process.env.PORT,
	MONGO: process.env.MONGODB,
	JWT: process.env.JWT_SECRET,
	IMAGEKIT_PUBLIC: process.env.IMAGEKIT_PUBLIC,
	IMAGEKIT_PRIVATE: process.env.IMAGEKIT_PRIVATE,
	IMAGEKIT_URI: process.env.IMAGEKIT_URI,
};

export default config