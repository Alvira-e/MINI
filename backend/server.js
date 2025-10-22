import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authroute from "./routes/auth.route.js";
import bookroute from "./routes/book.route.js";
import { verifytoken } from "./controllers/auth.controller.js";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected To MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// serve uploaded images (use absolute path relative to backend folder)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.listen(3001, () => {
  console.log("Server connected to 3001!!");
});

app.use("/api/auth", authroute);
app.use("/api/book", bookroute);
app.get("/api/auth/protected", verifytoken, (req, res) => {
  res.send("This is protected route!");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
