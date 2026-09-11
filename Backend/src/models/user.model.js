import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please enter a valid email']
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },

    role:{
        type: String,
        enum: ['user', 'artist'],
        default: 'user'
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("User", userSchema)

export default userModel;