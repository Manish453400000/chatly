import { Schema, model, mongo } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import dotenv from "dotenv";
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'lljfjlsaja';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'jflsjflfjslajf';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"]
  },
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url:{
      type: String, // cloudinary url
      required: true,
    }
  },
}, {timestamps: true})

userSchema.pre('save', async function(next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

userSchema.methods.isPasswordCorrect = async function(password: string) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
        _id: this._id,
        email: this.email,
    },
    accessTokenSecret,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  )
}

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
        _id: this._id,
        email: this.email,
    },
    refreshTokenSecret,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  )
}


export const User = model('User', userSchema);