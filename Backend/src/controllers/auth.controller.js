import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js'
import bcrypt from 'bcrypt'
import config from '../config/config.js'

export async function register(req, res) {
    try{
    const {username, email, password, role} = req.body;

    const alreadyExists = await userModel.exists({
        $or : [
            {username},
            {email} 
        ]
    })

    if(alreadyExists !== null){
        return res.status(409).json({
            message: "Already exists"
        })
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
        username,
        email,
        password: hashedPassword,
        role
    })

    const jwtToken = jwt.sign({
        id: newUser._id,
        role: newUser.role
    }, config.JWT, {
        expiresIn: '7d'
    })

    res.cookie('token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    })


    return res.status(201).json({
        message:"User created successfully",
        user:{
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
    })

    }
    catch(err){
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
    
}
