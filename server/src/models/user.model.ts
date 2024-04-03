import { Schema, model, mongo } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import dotenv from "dotenv";
dotenv.config();


import { 
  availableUserRoles,
  userRolesEnum
} from "../utils/constants";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'lljfjlsaja';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'jflsjflfjslajf';

const userSchema = new Schema({
  avatar: {
    type: {
      url: String,
      localPath: String,
    },
    default: {
      url: `http://res.cloudinary.com/dwl9iesij/image/upload/v1712124837/g1ehaegmay2e30bhc2ko.jpg`,
      localPath: '',
    }
  },
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: availableUserRoles,
    default: userRolesEnum.USER,
    required: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String
  }
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