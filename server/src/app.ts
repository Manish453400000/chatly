import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// middleware
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.get('/', (req, res) => {
    res.send("wellcome to homePage 2");
})
// import { userRouter } from "./routes/user.routes.js";

// app.use("/api/v1/users", userRouter);

export { app };
