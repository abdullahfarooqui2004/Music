import dotenv from 'dotenv'

dotenv.config()

if(!process.env.JWT_SECRET || !process.env.MONGODB){
    console.error("Error with enviroment variables")
}

const config = {
    PORT: process.env.PORT,
    MONGO: process.env.MONGODB,
    JWT: process.env.JWT_SECRET
}

export default config