import mongoose from 'mongoose'

const musicSchema = new mongoose.Schema({
    uri: {
        required:true,
        type: String
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

const musicModel = mongoose.model("Music", musicSchema)
export default musicModel