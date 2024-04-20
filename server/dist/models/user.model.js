"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const constants_1 = require("../utils/constants");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'lljfjlsaja';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'jflsjflfjslajf';
const userSchema = new mongoose_1.Schema({
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
    about: {
        type: String,
        trim: true,
        default: "Write somthing about you"
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    friends: {
        type: [
            {
                type: mongoose_1.Types.ObjectId,
                ref: 'User',
            },
        ],
        default: []
    },
    role: {
        type: String,
        enum: constants_1.availableUserRoles,
        default: constants_1.userRolesEnum.USER,
        required: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });
userSchema.pre('save', async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs_1.default.compare(password, this.password);
};
userSchema.methods.generateAccessToken = async function () {
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
    }, accessTokenSecret, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};
userSchema.methods.generateRefreshToken = async function () {
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
    }, refreshTokenSecret, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};
exports.User = (0, mongoose_1.model)('User', userSchema);
